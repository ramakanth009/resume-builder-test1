import os
import requests
from flask import Flask, request, jsonify, send_from_directory
import re
from datetime import datetime
from flask_cors import CORS
import json
from dotenv import load_dotenv
from urllib.parse import quote_plus

load_dotenv()

app = Flask(__name__, static_url_path='/static', static_folder='static')
CORS(app)

GROQ_API_KEY = os.getenv('GROQ_API_KEY', 'your_default_api_key')
GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'


def validate_email(email):
    """Validate email format."""
    return re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email) is not None

def validate_phone(phone):
    """Validate phone number format."""
    return re.match(r'^(\+\d{1,3}[- ]?)?\d{10}$', str(phone)) is not None

def validate_graduation_year(year):
    """Validate graduation year is between 2000 and 2030."""
    try:
        return 2000 <= int(year) <= 2030
    except ValueError:
        return False


def validate_work_experience_duration(duration):
    """Validate work experience duration format with some flexibility."""
    # Relaxed regex: allows full month names, lowercase abbreviations, and flexible present formats
    match = re.match(r'^([A-Za-z]{3,9} \d{4}) - (Present|[A-Za-z]{3,9} \d{4}|now)?$', duration)
    
    if not match:
        return False

    # Extract the start and end dates
    start_date_str = match.group(1)
    end_date_str = match.group(2)

    # Parse the start date, allowing full or abbreviated months
    try:
        start_date = datetime.strptime(start_date_str, '%b %Y')  # Abbreviated month (e.g., Jan 2020)
    except ValueError:
        try:
            start_date = datetime.strptime(start_date_str, '%B %Y')  # Full month (e.g., January 2020)
        except ValueError:
            return False  # Invalid start date format

    # Check if start date is in the future, allowing it as a valid input
    if start_date > datetime.now():
        return False

    # If there's an end date (either "Present" or a specific date), handle accordingly
    if end_date_str and end_date_str.lower() not in ["present", "now", ""]:
        try:
            end_date = datetime.strptime(end_date_str, '%b %Y')  # Abbreviated month
        except ValueError:
            try:
                end_date = datetime.strptime(end_date_str, '%B %Y')  # Full month
            except ValueError:
                return False  # Invalid end date format

        # Check if end date is valid
        if end_date > datetime.now() or end_date < start_date:
            return False

    return True


def validate_url(url, platform):
    """Validate GitHub and LinkedIn URLs."""
    if not url:  # Allow empty URLs
        return True
    
    patterns = {
        'github': r'^https?://(?:www\.)?github\.com/[\w-]+/?$',
        'linkedin': r'^https?://(?:www\.)?linkedin\.com/in/[\w-]+/?$',
        'portfolio': r'^https?://(?:[\w]+[-\.])*[\w]+(?:/[\w\-./?%&=]*)?$'
    }
    
    return bool(re.match(patterns.get(platform, patterns['portfolio']), url))


def validate_project(project):
    """Validate academic project structure."""
    required_fields = {'name', 'skills_used'}  # Removed description
    return (
        isinstance(project, dict) and 
        all(field in project for field in required_fields)
    )

def validate_work_experience(experience):
    """Validate work experience structure."""
    required_fields = {'position', 'company_name', 'duration', 'description'}
    return (
        isinstance(experience, dict) and 
        all(field in experience for field in required_fields)
    )

# Add this after the imports
RESUME_TEMPLATE = {
    "header": {
        "name": "",
        "email": "",
        "phone": "",
        "github": "",
        "linkedin": "",
        "portfolio": ""
    },
    "summary": "",
    "education": [{
        "degree": "",
        "institution": "",
        "graduationYear": ""
    }],
    "skills": [],
    "workExperience": [{
        "position": "",
        "companyName": "",
        "duration": "",
        "responsibilities": []
    }],
    "projects": [{
        "name": "",
        "description": ""
    }],
    "certifications": []  # Simple string array
}

def normalize_resume_structure(ai_output):
    """Normalize AI output to match the expected structure."""
    try:
        # Start with the template structure
        normalized = RESUME_TEMPLATE.copy()
        
        # Extract header information
        header = ai_output.get('header', {})
        normalized['header'] = {
            "name": header.get('name', ''),
            "email": header.get('email', ''),
            "phone": header.get('phone', ''),
            "github": header.get('github', ''),
            "linkedin": header.get('linkedin', ''),
            "portfolio": header.get('portfolio', '')
        }
        
        # Extract summary
        normalized['summary'] = ai_output.get('summary', '')
        
        # Extract and normalize education
        edu = ai_output.get('education', {})
        if isinstance(edu, dict):
            edu = [edu]
        normalized['education'] = [{
            "degree": e.get('degree', ''),
            "institution": e.get('institution', ''),
            "graduationYear": str(e.get('graduation_year', e.get('graduationYear', '')))
        } for e in edu]
        
        # Extract skills
        normalized['skills'] = ai_output.get('skills', [])
        
        # Extract and normalize work experience
        work_exp = ai_output.get('work_experience', ai_output.get('workExperience', []))
        normalized['workExperience'] = [{
            "position": exp.get('position', ''),
            "companyName": exp.get('company_name', exp.get('companyName', '')),
            "duration": exp.get('duration', ''),
            "responsibilities": exp.get('responsibilities', [])
        } for exp in work_exp]
        
        # Extract and normalize projects
        projects = ai_output.get('academic_projects', ai_output.get('projects', []))
        normalized['projects'] = [{
            "name": proj.get('name', ''),
            "description": proj.get('description', ''),
        } for proj in projects]
        
        # Extract certifications and normalize them
        certs = ai_output.get('certifications', [])
        normalized['certifications'] = [
            cert if isinstance(cert, str) else f"{cert.get('name')} by {cert.get('issuer')}"
            for cert in certs
        ]
        
        return normalized
        
    except Exception as e:
        print(f"Error normalizing resume structure: {str(e)}")
        return RESUME_TEMPLATE.copy()

@app.route('/generate_fresher_resume', methods=['POST'])
def generate_fresher_resume():
    """Handle resume generation request."""
    data = request.get_json()
    if not data:
        return jsonify({'status': 'error', 'message': 'No data provided'}), 400

    # Validation and required fields
    required_fields = [
        'name', 'email', 'phone', 'target_role',
        'degree', 'specialization', 'institution', 'graduation_year', 
        'skills', 'Academic_projects', 'certifications'
    ]

    # Check for missing fields
    missing_fields = [field for field in required_fields if field not in data or not str(data[field]).strip()]
    if missing_fields:
        return jsonify({'status': 'error', 'message': f'Missing or empty required fields: {", ".join(missing_fields)}'}), 400

    # Validate basic fields
    if not validate_email(data['email']):
        return jsonify({'status': 'error', 'message': 'Invalid email format'}), 400
    if not validate_phone(data['phone']):
        return jsonify({'status': 'error', 'message': 'Invalid phone number format'}), 400
    if not validate_graduation_year(data['graduation_year']):
        return jsonify({'status': 'error', 'message': 'Invalid graduation year'}), 400

    # Validate URLs if provided
    for platform in ['github', 'linkedin', 'portfolio']:
        if data.get(platform) and not validate_url(data[platform], platform):
            return jsonify({'status': 'error', 'message': f'Invalid {platform} URL format'}), 400

    # Validate academic projects
    for project in data['Academic_projects']:
        if not validate_project(project):
            return jsonify({
                'status': 'error', 
                'message': 'Invalid Academic Projects format. Each project must have name, skills_used'
            }), 400

    # Validate work experience if provided
    work_experience = data.get('work_experience', [])
    for exp in work_experience:
        if not validate_work_experience(exp):
            return jsonify({
                'status': 'error', 
                'message': 'Invalid Work Experience format. Each experience must have position, company_name, duration, and description'
            }), 400
        if not validate_work_experience_duration(exp['duration']):
            return jsonify({
                'status': 'error',
                'message': f'Invalid work experience duration format: {exp["duration"]}'
            }), 400
    # Prepare text for API prompt
    skills_text = ', '.join(data['skills'])
    certifications_text = ', '.join(data['certifications'])
    
    projects_text = '\n'.join([
        f"- {proj['name']} (Skills Used: {proj['skills_used']})"
        for proj in data['Academic_projects']
    ])

    work_experience_text = '\n'.join([
        f"- {exp['position']} at {exp['company_name']} ({exp['duration']})\n  Description: {exp['description']}"
        for exp in work_experience
    ]) if work_experience else "None"

    # Modify the prompt to be more specific about structure
    prompt = f"""
    Create an ATS-friendly professional resume following this exact JSON structure:
    {json.dumps(RESUME_TEMPLATE, indent=2)}

    Use these details to fill the structure:
    Name: {data['name']}
    Email: {data['email']}
    Phone: {data['phone']}
    GitHub: {data.get('github', '')}
    LinkedIn: {data.get('linkedin', '')}
    Portfolio: {data.get('portfolio', '')}
    Target Role: {data['target_role']}
    Education: {data['degree']} in {data['specialization']} from {data['institution']}, Graduated in {data['graduation_year']}
    Skills: {', '.join(data['skills'])}
    Certifications: {', '.join(data['certifications'])}

    Academic Projects:
    {projects_text}

    For each academic project:
    1. Provide a detailed description (2-3 sentences) explaining:
       - The project's purpose and main features
       - Technical implementation details
       - Your role and key achievements
       - Impact or results of the project
    2. Focus on technical aspects and problem-solving approaches
    3. Highlight the technologies and methodologies used

    Work Experience:
    {work_experience_text}

    For work experience responsibilities:
    1. Write 2-3 detailed bullet points for each role
    2. Each responsibility should:
       - Start with a strong action verb
       - Include quantifiable achievements where possible
       - Highlight technical skills used
       - Demonstrate impact on the organization
    3. Focus on relevant responsibilities based on the description: {exp.get('description', '')}

    Important:
    1. Follow the exact field names from the template
    2. Ensure all arrays are properly formatted
    3. Convert any null values to empty strings
    4. Keep the structure consistent
    5. Make descriptions ATS-friendly by incorporating relevant keywords
    6. Use professional, clear language
    """

    try:
        # Prepare API payload
        payload = {
            "model": "llama3-8b-8192",
            "messages": [
                {
                    "role": "system", 
                    "content": "You are an expert in creating detailed, ATS-friendly JSON resumes. Focus on providing comprehensive project descriptions and specific, measurable achievements in work responsibilities."
                },
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 2500,  # Increased token limit for more detailed responses
            "temperature": 0.3,   # Slightly increased for more creative descriptions
            "top_p": 1,
            "stream": False
        }

        headers = {
            'Authorization': f'Bearer {GROQ_API_KEY}',
            'Content-Type': 'application/json'
        }

        # Make API request
        response = requests.post(GROQ_API_URL, json=payload, headers=headers)
        response.raise_for_status()
        generated_content = response.json().get('choices', [{}])[0].get('message', {}).get('content', '')

        # Extract JSON from response
        json_match = re.search(r'```json\n(.*?)\n```', generated_content, re.DOTALL)
        if json_match:
            cleaned_json = json_match.group(1)
        else:
            # Fallback: Attempt to extract the largest valid JSON-like structure
            json_match = re.search(r'{.*}', generated_content, re.DOTALL)
            if not json_match:
                raise ValueError("No valid JSON structure found in the response")
            cleaned_json = json_match.group(0)

        # Parse and validate the JSON
        resume_json = json.loads(cleaned_json)
        
        # Normalize the structure
        normalized_resume = normalize_resume_structure(resume_json)
        
        return jsonify({
            "status": "success",
            "message": "Resume generated successfully.",
            "resume": normalized_resume
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
            "resume": RESUME_TEMPLATE  # Return empty template on error
        }), 500
if __name__ == '__main__':
    app.run(debug=True)