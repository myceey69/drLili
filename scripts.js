/* scripts.js
   Shared script for doctores.html + citas.html
   - No tel: or mailto: actions
   - Doctors page navigates to citas.html?doctor=<id>
   - Citas page preselects doctor from URL and requires fee agreement checkbox
*/

const doctors = [
  {
    id: "patel",
    name: "Dr. Aisha Patel, MD",
    specialty: "Cardiology",
    badge: "Heart Health",
    description:
      "Focuses on prevention, diagnosis, and treatment of heart conditions including hypertension, arrhythmias, and coronary artery disease.",
    phone: "+1 (555) 201-1101",
    email: "apatel@citycare.example",
    location: "Suite 210 • Mon–Thu",
    keywords: ["heart", "cardio"]
  },
  {
    id: "nguyen",
    name: "Dr. Minh Nguyen, DO",
    specialty: "Family Medicine",
    badge: "Primary Care",
    description:
      "Provides comprehensive care for adults and children, including annual checkups, chronic condition management, and preventive screenings.",
    phone: "+1 (555) 201-1102",
    email: "mnguyen@citycare.example",
    location: "Suite 105 • Mon–Fri",
    keywords: ["primary", "family"]
  },
  // Add additional doctor objects here...
];

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const byId = (id) => document.getElementById(id);

function getQueryParam(name) {
  try {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  } catch (e) {
    return null;
  }
}

/* Utility icons */
function icon(name) {
  const common =
    'width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"';
  if (name === "phone")
    return `<svg ${common}><path d="M7 4h2l1 5-2 1c1.2 2.4 3.1 4.3 5.5 5.5l1.1-2 5 1v2c0 1.1-.9 2-2 2C10.3 19 5 13.7 5 7c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  if (name === "mail")
    return `<svg ${common}><path d="M4 7c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V7z" stroke="currentColor" stroke-width="1.6"/><path d="M6 8l6 5 6-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  if (name === "pin")
    return `<svg ${common}><path d="M12 21s7-4.4 7-11a7 7 0 10-14 0c0 6.6 7 11 7 11z" stroke="currentColor" stroke-width="1.6"/><path d="M12 10.2a2.2 2.2 0 110-4.4 2.2 2.2 0 010 4.4z" stroke="currentColor" stroke-width="1.6"/></svg>`;
  return "";
}

/* --- Doctor card builder used on doctores.html --- */
function doctorCard(d) {
  const el = document.createElement("article");
  el.className = "card";
  el.setAttribute("data-id", d.id);
  el.innerHTML = `
    <div class="topRow">
      <div>
        <h3 class="name">${d.name}</h3>
        <div class="spec">${d.specialty}</div>
      </div>
      <div class="badge">${d.badge}</div>
    </div>

    <p class="desc">${d.description}</p>

    <div class="meta">
      <div class="metaRow">${icon("pin")} <strong>Where/when</strong> <span>•</span> <span>${d.location}</span></div>
      <div class="metaRow">${icon("phone")} <strong>Phone</strong> <span>•</span> <span>${d.phone}</span></div>
      <div class="metaRow">${icon("mail")} <strong>Email</strong> <span>•</span> <span>${d.email}</span></div>

      <div class="actions">
        <button class="miniBtn primary" type="button" data-schedule="${d.id}">📅 Solicitar cita</button>
        <button class="miniBtn" type="button" data-request="${d.id}">Solicitar</button>
      </div>

      <p class="hint" style="margin:8px 0 0;">
        Consultations are not free. Submit an appointment request to confirm availability and fees.
      </p>
    </div>
  `;

  const scheduleBtn = el.querySelector("[data-schedule]");
  const requestBtn = el.querySelector("[data-request]");

  if (scheduleBtn) {
    scheduleBtn.addEventListener("click", () => {
      window.location.href = `citas.html?doctor=${encodeURIComponent(d.id)}`;
    });
  }
  if (requestBtn) {
    requestBtn.addEventListener("click", () => {
      window.location.href = `citas.html?doctor=${encodeURIComponent(d.id)}`;
    });
  }

  return el;
}

/* --- Doctors page initialization --- */
function initDoctorsPage() {
  const doctorGrid = byId("doctorGrid");
  if (!doctorGrid) return; // Not on doctors page

  const searchInput = byId("searchInput");
  const specialtyFilter = byId("specialtyFilter");
  const sortBy = byId("sortBy");
  const kpiDoctors = byId("kpiDoctors");
  const yearEl = byId("year");

  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (kpiDoctors) kpiDoctors.textContent = String(doctors.length);

  // populate specialty filter
  const specs = Array.from(new Set(doctors.map((d) => d.specialty))).sort((a, b) =>
    a.localeCompare(b)
  );
  specs.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    specialtyFilter && specialtyFilter.appendChild(opt);
  });

  function matchesSearch(d, q) {
    if (!q) return true;
    q = q.toLowerCase().trim();
    const hay = [
      d.name,
      d.specialty,
      d.badge,
      d.description,
      d.location,
      d.email,
      d.phone,
      ...(d.keywords || []),
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  }

  function matchesSpecialty(d, spec) {
    return spec === "all" ? true : d.specialty === spec;
  }

  function sortDoctors(list, mode) {
    const arr = list.slice();
    if (mode === "specialty") {
      arr.sort((a, b) =>
        (a.specialty + a.name).localeCompare(b.specialty + b.name)
      );
    } else {
      arr.sort((a, b) => a.name.localeCompare(b.name));
    }
    return arr;
  }

  function render() {
    const q = searchInput ? searchInput.value : "";
    const spec = specialtyFilter ? specialtyFilter.value : "all";
    const mode = sortBy ? sortBy.value : "name";

    const filtered = doctors.filter((d) => matchesSearch(d, q) && matchesSpecialty(d, spec));
    const sorted = sortDoctors(filtered, mode);

    doctorGrid.innerHTML = "";
    if (sorted.length === 0) {
      const empty = document.createElement("div");
      empty.className = "panel";
      empty.style.gridColumn = "1 / -1";
      empty.innerHTML = `
        <h3 style="margin:0 0 6px;">No results</h3>
        <p class="hint" style="margin:0;">Try a different search term or change the specialty filter.</p>
      `;
      doctorGrid.appendChild(empty);
      return;
    }

    sorted.forEach((d) => doctorGrid.appendChild(doctorCard(d)));
  }

  searchInput && searchInput.addEventListener("input", render);
  specialtyFilter && specialtyFilter.addEventListener("change", render);
  sortBy && sortBy.addEventListener("change", render);

  render();
}

/* --- Citas (appointments) page initialization --- */
function initCitasPage() {
  const form = byId("contactForm");
  if (!form) return; // Not on citas page

  const doctorSelect = byId("doctorSelect");
  const yearEl = byId("year");
  const kpiDoctors = byId("kpiDoctors");
  const formStatus = byId("formStatus");
  const agreeFee = byId("agreeFee");

  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (kpiDoctors) kpiDoctors.textContent = String(doctors.length);

  // Populate select
  if (doctorSelect) {
    doctorSelect.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select a doctor";
    placeholder.disabled = true;
    placeholder.selected = true;
    doctorSelect.appendChild(placeholder);

    doctors
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((d) => {
        const opt = document.createElement("option");
        opt.value = d.id;
        opt.textContent = `${d.name} — ${d.specialty}`;
        doctorSelect.appendChild(opt);
      });
  }

  // Preselect from URL param if present
  const pre = getQueryParam("doctor");
  if (pre && doctorSelect) {
    // set value if option exists
    const exists = Array.from(doctorSelect.options).some((o) => o.value === pre);
    if (exists) doctorSelect.value = pre;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Double-check fee agreement
    if (agreeFee && !agreeFee.checked) {
      if (formStatus) formStatus.textContent = "You must agree that the consultation has a cost.";
      return;
    }

    const data = new FormData(form);
    const chosen = doctors.find((d) => d.id === data.get("doctorSelect"));
    const name = String(data.get("fullName") || "").trim();
    const email = String(data.get("email") || "").trim();

    // Demo behavior: do not open mail client or place calls.
    if (formStatus) {
      formStatus.textContent =
        `Thanks${name ? `, ${name}` : ""}! Your appointment request${chosen ? ` for ${chosen.name}` : ""} was recorded (demo). ` +
        `Our team will contact ${email || "you"} to confirm availability and fees. Consultations are not free.`;
    }

    // If you later wire a backend, replace the demo behavior with a fetch() POST here.
  });
}

/* --- DOM ready: initialize whichever page is active --- */
document.addEventListener("DOMContentLoaded", () => {
  try {
    initDoctorsPage();
  } catch (err) {
    console.error("initDoctorsPage error:", err);
  }
  try {
    initCitasPage();
  } catch (err) {
    console.error("initCitasPage error:", err);
  }

  // Provide "View doctors" modal/button support if present
  const openAllContacts = byId("openAllContacts");
  const modal = byId("contactsModal");
  const modalBody = byId("modalBody");
  const closeModal = byId("closeModal");

  if (openAllContacts && modal && modalBody) {
    openAllContacts.addEventListener("click", () => {
      // Build modal content
      modalBody.innerHTML = doctors
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(
          (d) => `
            <div class="panel" style="margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;">
                <div>
                  <div style="font-weight:900;">${d.name}</div>
                  <div class="hint" style="margin:2px 0 0;">${d.specialty} • ${d.location}</div>
                </div>
                <div class="badge" style="align-self:flex-start;">${d.badge}</div>
              </div>
              <div style="height:10px"></div>
              <div class="metaRow">${icon("phone")} <strong>Phone</strong> <span>•</span> <span>${d.phone}</span></div>
              <div class="metaRow">${icon("mail")} <strong>Email</strong> <span>•</span> <span>${d.email}</span></div>
              <div style="height:10px"></div>
              <button class="btn primary" type="button" data-modal-schedule="${d.id}">📅 Request appointment</button>
              <p class="hint" style="margin:10px 0 0;">Consultations are not free. Submit a request to confirm fees and availability.</p>
            </div>
          `
        )
        .join("");

      // Attach handlers to modal buttons
      modalBody.querySelectorAll("[data-modal-schedule]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-modal-schedule");
          try {
            modal.close();
          } catch (e) {
            // dialog.showModal/close may throw if not supported; attempt to hide
            modal.style.display = "none";
          }
          window.location.href = `citas.html?doctor=${encodeURIComponent(id)}`;
        });
      });

      // show modal (use dialog API if available)
      if (typeof modal.showModal === "function") {
        try {
          modal.showModal();
        } catch (e) {
          modal.style.display = "block";
        }
      } else {
        modal.style.display = "block";
      }
    });

    if (closeModal) {
      closeModal.addEventListener("click", () => {
        try {
          modal.close();
        } catch (e) {
          modal.style.display = "none";
        }
      });
    }

    // click outside to close (if dialog)
    modal.addEventListener("click", (e) => {
      const rect = modal.getBoundingClientRect();
      const inDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.bottom &&
        rect.left <= e.clientX &&
        e.clientX <= rect.right;
      if (!inDialog) {
        try {
          modal.close();
        } catch (err) {
          modal.style.display = "none";
        }
      }
    });
  }
});