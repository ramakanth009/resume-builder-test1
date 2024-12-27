import os
import requests
from flask import Flask, request, jsonify
import re
from datetime import datetime
from flask_cors import CORS
import json
import re

app = Flask(__name__)
CORS(app)

GROQ_API_KEY = os.getenv('GROQ_API_KEY', 'your_default_api_key')
GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

def validate_email(email):
    return re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email) is not None

def validate_phone(phone):
    return re.match(r'^(\+\d{1,3}[- ]?)?\d{10}$', str(phone)) is not None

def validate_graduation_year(year):
    try:
        return 1950 <= int(year) <= 2030
    except ValueError:
        return False

def validate_work_experience_duration(duration):
    match = re.match(r'^([A-Z][a-z]{2} \d{4}) - (Present|[A-Z][a-z]{2} \d{4})$', duration)
    if not match:
        return False

    start_date = datetime.strptime(match.group(1), '%b %Y')
    if start_date > datetime.now():
        return False

    if match.group(2) != "Present":
        end_date = datetime.strptime(match.group(2), '%b %Y')
        if end_date > datetime.now() or end_date < start_date:
            return False

    return True


@app.route('/generate_fresher_resume', methods=['POST'])
def generate_fresher_resume():
    data = request.get_json()
    if not data:
        return jsonify({'status': 'error', 'message': 'No data provided'}), 400

    # Validation and required fields
    required_fields = [
        'name', 'email', 'phone', 'target_role',
        'degree', 'specialization', 'institution', 'graduation_year', 'skills',
        'Academic_projects', 'certifications'
    ]
    missing_fields = [field for field in required_fields if field not in data or not str(data[field]).strip()]
    if missing_fields:
        return jsonify({'status': 'error', 'message': f'Missing or empty required fields: {", ".join(missing_fields)}'}), 400

    if not validate_email(data['email']):
        return jsonify({'status': 'error', 'message': 'Invalid email format'}), 400
    if not validate_phone(data['phone']):
        return jsonify({'status': 'error', 'message': 'Invalid phone number format'}), 400
    if not validate_graduation_year(data['graduation_year']):
        return jsonify({'status': 'error', 'message': 'Invalid graduation year'}), 400

    # Prepare input details for the API
    skills_text = ', '.join(data['skills'])
    certifications_text = ', '.join(data['certifications'])
    work_experience = data.get('work_experience', [])
    work_experience_text = '\n'.join([
        f"- {exp['position']} at {exp['company_name']} ({exp['duration']})"
        for exp in work_experience
    ]) if work_experience else "None"

    projects_text = '\n'.join([
        f"- {proj['name']} (Skills Used: {proj['skills_used']})"
        for proj in data['Academic_projects']
    ])

    # Prompt for the API to generate a detailed JSON resume
    prompt = f"""
    Create an ATS-friendly professional resume in JSON format with the following sections:
    - Header: Contains name, email, phone, github and linkedin profile links if provided.
    - Summary: A professional detailed summary tailored to the target role and user's provided data.
    - Education: Degree, specialization, institution, and graduation year.
    - Skills: A list of skills collected from analysing the user's data.
    - Certifications: A list of certifications.
    - Work Experience: List of jobs with company name, position, duration, and elaborated responsibilities.
    - Academic Projects: List of projects with name and detailed description based on the skills used.

    Here are the user details:
    Name: {data['name']}
    Email: {data['email']}
    Phone: {data['phone']}
    GitHub: {data.get('github', '')}
    LinkedIn: {data.get('linkedin', '')}
    Target Role: {data['target_role']}
    Education: {data['degree']} in {data['specialization']} from {data['institution']}, Graduated in {data['graduation_year']}
    Skills: {skills_text}
    Certifications: {certifications_text}
    Academic Projects:
    {projects_text}
    Work Experience:
    {work_experience_text}
    """

    # Payload for API
    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are an expert in creating ATS-friendly JSON resumes."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 2000,
        "temperature": 0.1,
        "top_p": 1,
        "stream": False
    }

    headers = {
        'Authorization': f'Bearer {GROQ_API_KEY}',
        'Content-Type': 'application/json'
    }

    try:
        response = requests.post(GROQ_API_URL, json=payload, headers=headers)
        response.raise_for_status()
        generated_content = response.json().get('choices', [{}])[0].get('message', {}).get('content', '')

        # Extract JSON from response
        json_match = re.search(r'```json\n(.*?)\n```', generated_content, re.DOTALL)
        if json_match:
            cleaned_json = json_match.group(1)
        else:
            # Fallback: Attempt to extract the largest valid JSON-like structure
            cleaned_json = re.search(r'{.*}', generated_content, re.DOTALL).group(0)

        # Parse the cleaned JSON
        resume_json = json.loads(cleaned_json)

        return jsonify({
            "status": "success",
            "message": "Resume generated successfully.",
            "resume": resume_json
        })
    except (json.JSONDecodeError, AttributeError) as e:
        return jsonify({
            "status": "error",
            "message": "Failed to parse the AI response into JSON.",
            "raw_response": generated_content
        }), 500
    except requests.exceptions.RequestException as e:
        return jsonify({'status': 'error', 'message': 'Error generating resume with Groq API.', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
