import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FileText, Save, ArrowLeft, Plus, Trash2, Mail, Phone, MapPin, Briefcase, GraduationCap, Code } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { resumeApi } from "../../api/resumeApi.js";
import { ROUTES } from "../../routes/routerpath.jsx";

export default function ResumeBuilderPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [formData, setFormData] = useState({
    personalDetails: {
      fullName: "",
      email: "",
      phone: "",
      title: "",
      summary: "",
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
  });

  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    resumeApi
      .getResume()
      .then((data) => {
        if (data.resume) {
          setFormData({
            personalDetails: {
              fullName: data.resume.personalDetails?.fullName || "",
              email: data.resume.personalDetails?.email || "",
              phone: data.resume.personalDetails?.phone || "",
              title: data.resume.personalDetails?.title || "",
              summary: data.resume.personalDetails?.summary || "",
            },
            education: data.resume.education || [],
            experience: data.resume.experience || [],
            skills: data.resume.skills || [],
            projects: data.resume.projects || [],
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load resume:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [name]: value,
      },
    }));
  };

  // Education Helpers
  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { school: "", degree: "", startYear: "", endYear: "" }],
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...formData.education];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, education: updated }));
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Experience Helpers
  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [...prev.experience, { company: "", position: "", startYear: "", endYear: "", description: "" }],
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...formData.experience];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, experience: updated }));
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  // Skills Helpers
  const addSkill = (e) => {
    e.preventDefault();
    const clean = skillInput.trim();
    if (clean && !formData.skills.includes(clean)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, clean],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  // Projects Helpers
  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: "", description: "", technologies: [] }],
    }));
  };

  const handleProjectChange = (index, field, value) => {
    const updated = [...formData.projects];
    if (field === "technologies") {
      updated[index][field] = value.split(",").map((t) => t.trim()).filter(Boolean);
    } else {
      updated[index][field] = value;
    }
    setFormData((prev) => ({ ...prev, projects: updated }));
  };

  const removeProject = (index) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    resumeApi
      .saveResume(formData)
      .then((data) => {
        setMessage({ text: "Resume saved successfully!", type: "success" });
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
          navigate(ROUTES.CANDIDATE_DASHBOARD);
        }, 1500);
      })
      .catch((err) => {
        console.error("Save error:", err);
        setMessage({ text: "Failed to save resume. Please try again.", type: "error" });
      })
      .finally(() => {
        setSaving(false);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-muted text-sm">Loading resume builder...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Build & Customize Your Resume — CareerHub</title>
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-[#F5F7FA] py-8 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate(ROUTES.CANDIDATE_DASHBOARD)}
              className="flex items-center gap-1.5 text-navy hover:text-navy-soft text-sm font-semibold transition"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <h1 className="hidden md:block font-display font-bold text-xl text-navy">Interactive Resume Builder</h1>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-1.5 bg-navy text-white text-sm font-semibold rounded-xl px-5 py-2.5 hover:bg-navy-soft active:scale-[0.98] transition disabled:opacity-60 shadow-sm"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Resume"}
            </button>
          </div>

          {message.text && (
            <div
              className={`mb-6 p-4 rounded-xl border text-sm text-center font-medium ${
                message.type === "success"
                  ? "bg-teal/10 border-teal/20 text-teal"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Form Inputs (Left) */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Details */}
              <section className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="font-display font-bold text-lg text-navy mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                    <FileText size={15} />
                  </span>
                  Personal Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5B6B85] uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.personalDetails.fullName}
                      onChange={handlePersonalChange}
                      required
                      placeholder="e.g. Priya Nair"
                      className="w-full text-sm rounded-lg border border-border px-3 py-2.5 outline-none focus-visible:border-violet"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5B6B85] uppercase tracking-wider mb-1.5">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.personalDetails.title}
                      onChange={handlePersonalChange}
                      placeholder="e.g. Senior Frontend Developer"
                      className="w-full text-sm rounded-lg border border-border px-3 py-2.5 outline-none focus-visible:border-violet"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5B6B85] uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.personalDetails.email}
                      onChange={handlePersonalChange}
                      required
                      placeholder="you@example.com"
                      className="w-full text-sm rounded-lg border border-border px-3 py-2.5 outline-none focus-visible:border-violet"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5B6B85] uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.personalDetails.phone}
                      onChange={handlePersonalChange}
                      required
                      placeholder="e.g. 9876543210"
                      className="w-full text-sm rounded-lg border border-border px-3 py-2.5 outline-none focus-visible:border-violet"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#5B6B85] uppercase tracking-wider mb-1.5">
                      Professional Summary / Bio
                    </label>
                    <textarea
                      name="summary"
                      rows={3}
                      value={formData.personalDetails.summary}
                      onChange={handlePersonalChange}
                      placeholder="Write a brief intro highlighting your core experience and strengths..."
                      className="w-full text-sm rounded-lg border border-border px-3 py-2.5 outline-none focus-visible:border-violet resize-none"
                    ></textarea>
                  </div>
                </div>
              </section>

              {/* Skills */}
              <section className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="font-display font-bold text-lg text-navy mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                    <Code size={15} />
                  </span>
                  Technical Skills
                </h2>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="e.g. React, Python, UI/UX"
                    className="flex-1 text-sm rounded-lg border border-border px-3 py-2 outline-none focus-visible:border-violet"
                  />
                  <button
                    onClick={addSkill}
                    className="bg-navy text-white text-xs font-semibold rounded-lg px-4 py-2 hover:bg-navy-soft transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-semibold text-navy bg-gold/10 border border-gold/30 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-navy/50 hover:text-red-600 transition"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  {formData.skills.length === 0 && (
                    <p className="text-xs text-text-muted italic">No skills added yet.</p>
                  )}
                </div>
              </section>

              {/* Work Experience */}
              <section className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display font-bold text-lg text-navy flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                      <Briefcase size={15} />
                    </span>
                    Work Experience
                  </h2>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="text-xs font-bold text-violet flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} /> Add Experience
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.experience.map((exp, idx) => (
                    <div key={idx} className="relative border-l-2 border-[#E3E8F0] pl-4 space-y-3 pb-2">
                      <button
                        type="button"
                        onClick={() => removeExperience(idx)}
                        className="absolute right-0 top-0 text-text-muted hover:text-red-600 transition"
                        title="Remove experience"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-[#5B6B85] uppercase tracking-wider mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(idx, "company", e.target.value)}
                            placeholder="e.g. Nimbus Systems"
                            className="w-full text-xs rounded-lg border border-border px-3 py-2 outline-none focus-visible:border-violet"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#5B6B85] uppercase tracking-wider mb-1">
                            Position / Title
                          </label>
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => handleExperienceChange(idx, "position", e.target.value)}
                            placeholder="e.g. SDE-2"
                            className="w-full text-xs rounded-lg border border-border px-3 py-2 outline-none focus-visible:border-violet"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#5B6B85] uppercase tracking-wider mb-1">
                            Start Year
                          </label>
                          <input
                            type="text"
                            value={exp.startYear}
                            onChange={(e) => handleExperienceChange(idx, "startYear", e.target.value)}
                            placeholder="e.g. 2022"
                            className="w-full text-xs rounded-lg border border-border px-3 py-2 outline-none focus-visible:border-violet"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#5B6B85] uppercase tracking-wider mb-1">
                            End Year (or Present)
                          </label>
                          <input
                            type="text"
                            value={exp.endYear}
                            onChange={(e) => handleExperienceChange(idx, "endYear", e.target.value)}
                            placeholder="e.g. Present"
                            className="w-full text-xs rounded-lg border border-border px-3 py-2 outline-none focus-visible:border-violet"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-semibold text-[#5B6B85] uppercase tracking-wider mb-1">
                            Role Description
                          </label>
                          <textarea
                            rows={2}
                            value={exp.description}
                            onChange={(e) => handleExperienceChange(idx, "description", e.target.value)}
                            placeholder="Briefly describe your achievements and day-to-day responsibilities..."
                            className="w-full text-xs rounded-lg border border-border px-3 py-2 outline-none focus-visible:border-violet resize-none"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.experience.length === 0 && (
                    <p className="text-xs text-text-muted italic">Click 'Add Experience' to list your jobs.</p>
                  )}
                </div>
              </section>

              {/* Education */}
              <section className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display font-bold text-lg text-navy flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                      <GraduationCap size={15} />
                    </span>
                    Education History
                  </h2>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="text-xs font-bold text-violet flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} /> Add Education
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.education.map((edu, idx) => (
                    <div key={idx} className="relative border-l-2 border-[#E3E8F0] pl-4 space-y-3 pb-2">
                      <button
                        type="button"
                        onClick={() => removeEducation(idx)}
                        className="absolute right-0 top-0 text-text-muted hover:text-red-600 transition"
                        title="Remove education"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-[#5B6B85] uppercase tracking-wider mb-1">
                            School / College
                          </label>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => handleEducationChange(idx, "school", e.target.value)}
                            placeholder="e.g. LPU"
                            className="w-full text-xs rounded-lg border border-border px-3 py-2 outline-none focus-visible:border-violet"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#5B6B85] uppercase tracking-wider mb-1">
                            Degree / Course
                          </label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(idx, "degree", e.target.value)}
                            placeholder="e.g. B.Tech Computer Science"
                            className="w-full text-xs rounded-lg border border-border px-3 py-2 outline-none focus-visible:border-violet"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#5B6B85] uppercase tracking-wider mb-1">
                            Start Year
                          </label>
                          <input
                            type="text"
                            value={edu.startYear}
                            onChange={(e) => handleEducationChange(idx, "startYear", e.target.value)}
                            placeholder="e.g. 2018"
                            className="w-full text-xs rounded-lg border border-border px-3 py-2 outline-none focus-visible:border-violet"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#5B6B85] uppercase tracking-wider mb-1">
                            End Year
                          </label>
                          <input
                            type="text"
                            value={edu.endYear}
                            onChange={(e) => handleEducationChange(idx, "endYear", e.target.value)}
                            placeholder="e.g. 2022"
                            className="w-full text-xs rounded-lg border border-border px-3 py-2 outline-none focus-visible:border-violet"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.education.length === 0 && (
                    <p className="text-xs text-text-muted italic">Click 'Add Education' to list your degrees.</p>
                  )}
                </div>
              </section>

              {/* Projects */}
              <section className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display font-bold text-lg text-navy flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                      <Code size={15} />
                    </span>
                    Featured Projects
                  </h2>
                  <button
                    type="button"
                    onClick={addProject}
                    className="text-xs font-bold text-violet flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} /> Add Project
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.projects.map((proj, idx) => (
                    <div key={idx} className="relative border-l-2 border-[#E3E8F0] pl-4 space-y-3 pb-2">
                      <button
                        type="button"
                        onClick={() => removeProject(idx)}
                        className="absolute right-0 top-0 text-text-muted hover:text-red-600 transition"
                        title="Remove project"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-semibold text-[#5B6B85] uppercase tracking-wider mb-1">
                            Project Title
                          </label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => handleProjectChange(idx, "title", e.target.value)}
                            placeholder="e.g. E-Commerce Microservice Platform"
                            className="w-full text-xs rounded-lg border border-border px-3 py-2 outline-none focus-visible:border-violet"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-semibold text-[#5B6B85] uppercase tracking-wider mb-1">
                            Technologies used (comma separated)
                          </label>
                          <input
                            type="text"
                            value={proj.technologies?.join(", ") || ""}
                            onChange={(e) => handleProjectChange(idx, "technologies", e.target.value)}
                            placeholder="e.g. React, Node.js, Docker"
                            className="w-full text-xs rounded-lg border border-border px-3 py-2 outline-none focus-visible:border-violet"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-semibold text-[#5B6B85] uppercase tracking-wider mb-1">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            value={proj.description}
                            onChange={(e) => handleProjectChange(idx, "description", e.target.value)}
                            placeholder="Write a brief overview of the project and your impact..."
                            className="w-full text-xs rounded-lg border border-border px-3 py-2 outline-none focus-visible:border-violet resize-none"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.projects.length === 0 && (
                    <p className="text-xs text-text-muted italic">Click 'Add Project' to showcase your code.</p>
                  )}
                </div>
              </section>
            </form>

            {/* LIVE PREVIEW (Right) */}
            <section className="sticky top-24 bg-white rounded-2xl border-2 border-dashed border-border p-6 sm:p-8 shadow-md min-h-[600px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-border mb-6">
                  <span className="text-xs font-semibold text-[#5B6B85] uppercase tracking-wider">
                    Live Resume Sheet
                  </span>
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                  </div>
                </div>

                {/* Simulated Document Layout */}
                <div className="font-body text-[#16213A] max-w-lg mx-auto">
                  {/* Top Header details */}
                  <div className="text-center space-y-1 pb-5 border-b-2 border-navy">
                    <h3 className="font-display font-bold text-2xl text-navy tracking-tight">
                      {formData.personalDetails.fullName || "Your Full Name"}
                    </h3>
                    <p className="text-violet font-semibold text-sm tracking-wide">
                      {formData.personalDetails.title || "Your Professional Title"}
                    </p>
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-[#5B6B85] pt-1">
                      {formData.personalDetails.email && (
                        <span className="flex items-center gap-1">
                          <Mail size={12} /> {formData.personalDetails.email}
                        </span>
                      )}
                      {formData.personalDetails.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={12} /> {formData.personalDetails.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Summary Section */}
                  {formData.personalDetails.summary && (
                    <div className="mt-5">
                      <h4 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-border pb-1">
                        Professional Summary
                      </h4>
                      <p className="text-[13px] leading-relaxed text-[#16213A]/90 mt-1.5 whitespace-pre-line">
                        {formData.personalDetails.summary}
                      </p>
                    </div>
                  )}

                  {/* Work Experience Section */}
                  {formData.experience.length > 0 && (
                    <div className="mt-5">
                      <h4 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-border pb-1">
                        Experience
                      </h4>
                      <div className="space-y-4 mt-2">
                        {formData.experience.map(
                          (exp, i) =>
                            (exp.company || exp.position) && (
                              <div key={i} className="text-xs">
                                <div className="flex justify-between font-semibold text-navy">
                                  <span>{exp.position || "Untitled Position"}</span>
                                  <span>
                                    {exp.startYear} - {exp.endYear || "Present"}
                                  </span>
                                </div>
                                <div className="text-[#5B6B85] italic font-medium">{exp.company || "Company"}</div>
                                {exp.description && (
                                  <p className="text-[11px] text-[#16213A]/85 mt-1 leading-relaxed whitespace-pre-line">
                                    {exp.description}
                                  </p>
                                )}
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Education Section */}
                  {formData.education.length > 0 && (
                    <div className="mt-5">
                      <h4 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-border pb-1">
                        Education
                      </h4>
                      <div className="space-y-3 mt-2">
                        {formData.education.map(
                          (edu, i) =>
                            (edu.school || edu.degree) && (
                              <div key={i} className="text-xs flex justify-between">
                                <div>
                                  <span className="font-semibold text-navy">{edu.degree || "Degree"}</span>
                                  <span className="text-[#5B6B85]"> at {edu.school || "School"}</span>
                                </div>
                                <span className="shrink-0 text-[#5B6B85]">
                                  {edu.startYear} - {edu.endYear}
                                </span>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Skills Section */}
                  {formData.skills.length > 0 && (
                    <div className="mt-5">
                      <h4 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-border pb-1">
                        Skills
                      </h4>
                      <p className="text-xs text-[#16213A] mt-1.5 leading-relaxed font-semibold">
                        {formData.skills.join(" · ")}
                      </p>
                    </div>
                  )}

                  {/* Projects Section */}
                  {formData.projects.length > 0 && (
                    <div className="mt-5">
                      <h4 className="text-xs font-bold text-navy uppercase tracking-wider border-b border-border pb-1">
                        Featured Projects
                      </h4>
                      <div className="space-y-4 mt-2">
                        {formData.projects.map(
                          (proj, i) =>
                            proj.title && (
                              <div key={i} className="text-xs">
                                <div className="flex justify-between font-semibold text-navy">
                                  <span>{proj.title}</span>
                                </div>
                                {proj.technologies?.length > 0 && (
                                  <div className="text-[#5B6B85] font-mono-num text-[10px] mt-0.5">
                                    Tech Stack: {proj.technologies.join(", ")}
                                  </div>
                                )}
                                {proj.description && (
                                  <p className="text-[11px] text-[#16213A]/85 mt-1 leading-relaxed">
                                    {proj.description}
                                  </p>
                                )}
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Print / Save Notice */}
              <div className="border-t border-border mt-8 pt-4 flex justify-between items-center text-[10px] text-text-muted">
                <span>Created using CareerHub Resume Builder</span>
                <span>Ready to Share</span>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
