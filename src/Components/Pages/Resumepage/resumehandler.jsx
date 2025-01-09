// Utility functions
const cleanString = (str) => {
  if (!str) return '';
  return typeof str === 'string' ? str.trim() : String(str).trim();
};

const ensureArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(cleanString).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map(item => cleanString(item)).filter(Boolean);
  return [];
};

const normalizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return {};
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key.toLowerCase()] = value;
    return acc;
  }, {});
};

export const transformHeaderData = (headerData = {}) => {
  const normalized = normalizeObject(headerData);
  
  return {
    name: cleanString(headerData?.name || normalized?.name || ''),
    email: cleanString(headerData?.email || normalized?.email || ''),
    phone: cleanString(headerData?.phone || normalized?.phone || ''),
    github: cleanString(headerData?.github || normalized?.github || ''),
    linkedin: cleanString(headerData?.linkedin || normalized?.linkedin || ''),
    portfolio: cleanString(headerData?.portfolio || normalized?.portfolio || '')
  };
};

export const transformWorkExperience = (workExp = []) => {
  if (!workExp) return [];
  const workArray = Array.isArray(workExp) ? workExp : [workExp];

  return workArray
    .filter(exp => exp && typeof exp === 'object')
    .map(exp => {
      const normalized = normalizeObject(exp);
      let responsibilities = Array.isArray(exp.responsibilities)
        ? exp.responsibilities
        : typeof normalized.description === "string"
        ? [normalized.description]
        : [];

      return {
        position: cleanString(exp.position || normalized.position),
        companyName: cleanString(exp.companyName || normalized.companyName),
        duration: cleanString(exp.duration || normalized.duration),
        responsibilities: responsibilities.map(cleanString).filter(Boolean),
      };
    })
    .filter(exp => exp.position || exp.companyName);
};

export const transformEducation = (edu = []) => {
  if (!edu) return [];
  const eduArray = Array.isArray(edu) ? edu : [edu];

  return eduArray
    .filter(e => e && typeof e === 'object')
    .map(e => {
      const normalized = normalizeObject(e);
      return {
        degree: cleanString(e.degree || normalized.degree),
        specialization: cleanString(e.specialization || normalized.specialization),
        institution: cleanString(e.institution || normalized.institution),
        graduationYear: cleanString(e.graduationYear || e.graduationyear || normalized.graduationyear || normalized.graduationYear)
      };
    });
};

export const transformProjects = (projects = []) => {
  if (!projects) return [];
  const projectArray = Array.isArray(projects) ? projects : [projects];

  return projectArray
    .filter(proj => proj && typeof proj === 'object')
    .map(proj => {
      const normalized = normalizeObject(proj);
      
      let technologies = [];
      if (Array.isArray(proj.technologies)) {
        technologies = proj.technologies;
      } else if (typeof proj.skills_used === 'string') {
        technologies = proj.skills_used.split(',');
      } else if (typeof normalized.skills_used === 'string') {
        technologies = normalized.skills_used.split(',');
      }

      return {
        name: cleanString(proj.name || normalized.name),
        description: cleanString(proj.description || normalized.description),
        technologies: technologies.map(cleanString).filter(Boolean)
      };
    })
    .filter(proj => proj.name);
};

export const transformSkills = (skillsData) => {
  if (!skillsData) return [];

  let skills = [];
  
  if (Array.isArray(skillsData)) {
    skills = skillsData;
  } else if (typeof skillsData === 'string') {
    skills = skillsData.split(',');
  } else if (skillsData?.skills) {
    skills = Array.isArray(skillsData.skills) ? skillsData.skills : [skillsData.skills];
  } else if (skillsData?.Skills) {
    skills = Array.isArray(skillsData.Skills) ? skillsData.Skills : [skillsData.Skills];
  }

  return skills.map(cleanString).filter(Boolean);
};

export const transformSummary = (summaryData) => {
  if (!summaryData) return '';
  
  if (typeof summaryData === 'string') {
    return cleanString(summaryData);
  }
  
  if (typeof summaryData === 'object') {
    const normalized = normalizeObject(summaryData);
    return cleanString(
      summaryData.summary || 
      summaryData.objective ||
      normalized.summary ||
      normalized.objective ||
      ''
    );
  }
  
  return '';
};

export const transformCertifications = (certData) => {
  if (!certData) return [];
  
  let certs = [];
  if (Array.isArray(certData)) {
    certs = certData;
  } else if (typeof certData === 'string') {
    certs = certData.split(',');
  } else if (certData?.certifications) {
    certs = Array.isArray(certData.certifications) ? 
      certData.certifications : 
      [certData.certifications];
  } else if (typeof certData === 'object') {
    certs = Object.values(certData);
  }

  return certs.map(cleanString).filter(Boolean);
};

export const transformResumeData = (apiResponse) => {
  if (!apiResponse?.resume) {
    throw new Error('Invalid API response: missing resume data');
  }
  console.log("apiResponse in transformResumeData fn ", apiResponse);

  const { resume } = apiResponse;
  const normalized = normalizeObject(resume);

  try {
    const transformedData = {
      header: transformHeaderData(resume.header || normalized.header),
      summary: transformSummary(resume.summary || normalized.summary),
      skills: transformSkills(resume.skills || normalized.skills),
      workExperience: transformWorkExperience(
        resume.workExperience || 
        normalized.workExperience
      ),
      education: transformEducation(resume.education || normalized.education),
      projects: transformProjects(
        resume.projects || 
        normalized.projects
      ),
      certifications: transformCertifications(
        resume.certifications || 
        normalized.certifications
      )
    };

    Object.keys(transformedData).forEach(key => {
      if (Array.isArray(transformedData[key])) {
        transformedData[key] = transformedData[key].filter(Boolean);
      }
    });
    console.log("transformedData in transformResumeData fn ", transformedData);

    return transformedData;
  } catch (error) {
    console.error('Data transformation error:', error);
    throw new Error(`Failed to transform resume data: ${error.message}`);
  }
};