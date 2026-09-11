export default function ExperienceBasicInfo({
  formData,
  updateField,
  loading,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          Basic Information
        </h2>

        <p className="mt-1 text-sm text-white/50">
          Add the company and position details.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-white/70">
            Company
          </label>

          <input
            type="text"
            value={formData.company}
            onChange={(e) =>
              updateField("company", e.target.value)
            }
            placeholder="e.g. SQI College of ICT"
            disabled={loading}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30 focus:border-indigo-500/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/70">
            Role
          </label>

          <input
            type="text"
            value={formData.role}
            onChange={(e) =>
              updateField("role", e.target.value)
            }
            placeholder="e.g. Software Engineering Intern"
            disabled={loading}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30 focus:border-indigo-500/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/70">
            Employment Type
          </label>

          <select
            value={formData.employmentType}
            onChange={(e) =>
              updateField(
                "employmentType",
                e.target.value
              )
            }
            disabled={loading}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-indigo-500/50"
          >
            <option value="Internship">
              Internship
            </option>
            <option value="Full-time">
              Full-time
            </option>
            <option value="Part-time">
              Part-time
            </option>
            <option value="Contract">
              Contract
            </option>
            <option value="Freelance">
              Freelance
            </option>
            <option value="Volunteer">
              Volunteer
            </option>
            <option value="Other">
              Other
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/70">
            Location
          </label>

          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              updateField(
                "location",
                e.target.value
              )
            }
            placeholder="e.g. Ogbomoso, Nigeria"
            disabled={loading}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30 focus:border-indigo-500/50"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-white/70">
          Description
        </label>

        <textarea
          value={formData.description}
          onChange={(e) =>
            updateField(
              "description",
              e.target.value
            )
          }
          placeholder="Describe your responsibilities, achievements and experience..."
          rows={7}
          disabled={loading}
          className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30 focus:border-indigo-500/50"
        />
      </div>
    </div>
  );
}