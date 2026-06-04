const SERVICE_CONFIG = {
  curso: {
    title: "Cursos",
    baseUrl: "http://localhost:8082/api/courses",
    fields: [
      {name: "name", label: "Nombre del curso", type: "text"},
      {name: "description", label: "Descripción", type: "textarea"},
      {name: "teacherId", label: "ID Profesor", type: "number"},
      {name: "credits", label: "Créditos", type: "number"},
      {name: "maxStudents", label: "Máximo estudiantes", type: "number"},
      {name: "approvalPercentage", label: "Porcentaje de aprobación", type: "number", min: 1, max: 100}
    ]
  },
  usuario: {
    title: "Estudiantes",
    baseUrl: "http://localhost:8081/api/students",
    fields: [
      {name: "firstName", label: "Nombre", type: "text"},
      {name: "lastName", label: "Apellido", type: "text"},
      {name: "email", label: "Email", type: "email"},
      {name: "phone", label: "Teléfono", type: "text"},
      {name: "address", label: "Dirección", type: "text"},
      {name: "comuna", label: "Comuna", type: "select", options: []}
    ]
  },
  profesor: {
    title: "Profesores",
    baseUrl: "http://localhost:8081/api/teachers",
    fields: [
      {name: "firstName", label: "Nombre", type: "text"},
      {name: "lastName", label: "Apellido", type: "text"},
      {name: "email", label: "Email", type: "email"},
      {name: "phone", label: "Teléfono", type: "text"},
      {name: "address", label: "Dirección", type: "text"},
      {name: "specialty", label: "Especialidad", type: "text"}
    ]
  },
  pago: {
    title: "Pagos",
    baseUrl: "http://localhost:8083/api/payments",
    fields: [
      {name: "studentId", label: "ID Estudiante", type: "number"},
      {name: "courseId", label: "ID Curso", type: "number"},
      {name: "amount", label: "Monto", type: "number", step: "0.01"},
      {name: "status", label: "Estado", type: "text"},
      {name: "dueDate", label: "Fecha de vencimiento", type: "date"}
    ]
  },
  notificacion: {
    title: "Notificaciones",
    baseUrl: "http://localhost:8084/api/notifications",
    fields: [
      {name: "recipient", label: "Destinatario", type: "text"},
      {name: "message", label: "Mensaje", type: "textarea"},
      {name: "type", label: "Tipo", type: "text"},
      {name: "sent", label: "Enviado", type: "checkbox"}
    ]
  }
};

const serviceSelect = document.getElementById("serviceSelect");
const listTitle = document.getElementById("listTitle");
const formTitle = document.getElementById("formTitle");
const listContainer = document.getElementById("listContainer");
const formFields = document.getElementById("formFields");
const entityForm = document.getElementById("entityForm");
const entityIdInput = document.getElementById("entityId");
const messageBox = document.getElementById("messageBox");
const refreshButton = document.getElementById("refreshButton");
const clearButton = document.getElementById("clearButton");
const crudTab = document.getElementById("crudTab");
const dashboardTab = document.getElementById("dashboardTab");
const crudPage = document.getElementById("crudPage");
const dashboardPage = document.getElementById("dashboardPage");
const dashboardPieCanvas = document.getElementById("dashboardPieChart");
const chartInfo = document.getElementById("chartInfo");
const dashboardBarCanvas = document.getElementById("dashboardBarChart");
const barChartInfo = document.getElementById("barChartInfo");
const reportContainer = document.getElementById("reportContainer");
const exportButton = document.getElementById("exportButton");

let teachersMapCache = null;
let currentListData = [];

function resizeCanvas(canvas, ctx) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(0, Math.floor(rect.width));
  const height = Math.max(0, Math.floor(rect.height));

  if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height, dpr };
}

let currentServiceKey = "curso";
let currentPage = "crud";
let pieChartState = {
  entries: [],
  colors: [],
  total: 0,
  selectedIndex: null,
  hoverIndex: null
};
let barChartState = {
  entries: [],
  selectedIndex: null,
  hoverIndex: null
};

function init() {
  Object.keys(SERVICE_CONFIG).forEach(key => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = SERVICE_CONFIG[key].title;
    serviceSelect.appendChild(option);
  });

  serviceSelect.addEventListener("change", onServiceChange);
  refreshButton.addEventListener("click", renderCurrentService);
  exportButton.addEventListener("click", exportCurrentServiceReport);
  clearButton.addEventListener("click", resetForm);
  entityForm.addEventListener("submit", onSubmit);
  crudTab.addEventListener("click", () => setPage("crud"));
  dashboardTab.addEventListener("click", () => setPage("dashboard"));

  serviceSelect.value = currentServiceKey;
  setPage("crud");
  renderCurrentService();
}

function onServiceChange(event) {
  currentServiceKey = event.target.value;
  resetForm();
  renderCurrentService();
}

function setPage(page) {
  currentPage = page;
  const isCrud = page === "crud";
  crudPage.classList.toggle("page-hidden", !isCrud);
  dashboardPage.classList.toggle("page-hidden", isCrud);
  crudTab.classList.toggle("active", isCrud);
  dashboardTab.classList.toggle("active", !isCrud);

  if (isCrud) {
    renderCurrentService();
  } else {
    renderDashboard();
  }
}

function renderCurrentService() {
  const config = SERVICE_CONFIG[currentServiceKey];
  listTitle.textContent = `Listado de ${config.title}`;
  formTitle.textContent = `Crear o editar ${config.title.slice(0, -1)}`;
  document.getElementById("listDescription").textContent = `Administra los registros de ${config.title}`;
  reportContainer.innerHTML = "";
  currentListData = [];
  buildForm(config);
  loadList(config);
}

function buildForm(config) {
  formFields.innerHTML = "";

  config.fields.forEach(field => {
    const group = document.createElement("div");
    group.className = "form-group";

    const label = document.createElement("label");
    label.htmlFor = field.name;
    label.textContent = field.label;

    let input;
    if (field.type === "textarea") {
      input = document.createElement("textarea");
    } else if (field.type === "select") {
      input = document.createElement("select");
      if (field.options.length === 0 && field.name === "comuna") {
        loadComunas(input);
      }
    } else {
      input = document.createElement("input");
      input.type = field.type;
    }

    input.id = field.name;
    input.name = field.name;
    input.placeholder = field.label;
    if (field.min !== undefined) input.min = field.min;
    if (field.max !== undefined) input.max = field.max;
    if (field.step !== undefined) input.step = field.step;
    if (field.type === "checkbox") input.value = "true";

    group.appendChild(label);
    group.appendChild(input);
    formFields.appendChild(group);
  });
}

async function loadComunas(selectElement) {
  const userConfig = SERVICE_CONFIG.usuario;
  try {
    const response = await fetch(`${userConfig.baseUrl}/comunas`);
    const comunas = await response.json();
    populateComunaOptions(selectElement, comunas);
  } catch (error) {
    populateComunaOptions(selectElement, [
      "Ñuñoa", "Providencia", "Las Condes", "Santiago", "Maipú", "La Florida", "Puente Alto"
    ]);
  }
}

function populateComunaOptions(selectElement, options) {
  selectElement.innerHTML = "";
  const noneOption = document.createElement("option");
  noneOption.value = "";
  noneOption.textContent = "Sin comuna";
  selectElement.appendChild(noneOption);
  options.forEach(comuna => {
    const option = document.createElement("option");
    option.value = comuna;
    option.textContent = comuna;
    selectElement.appendChild(option);
  });
}

async function loadList(config) {
  try {
    const response = await fetch(config.baseUrl);
    const data = await response.json();
    currentListData = Array.isArray(data) ? data : [];
    renderList(currentListData, config);
    showMessage(`Datos de ${config.title} cargados correctamente.`, false);
  } catch (error) {
    showMessage(`No se pudo cargar ${config.title}. Verifica que el servicio esté activo.`, true);
    listContainer.innerHTML = "";
  }
}

function exportCurrentServiceReport() {
  if (!currentListData || currentListData.length === 0) {
    showMessage("No hay datos cargados para exportar.", true);
    return;
  }

  const config = SERVICE_CONFIG[currentServiceKey];
  if (currentServiceKey === "curso") {
    exportCourseReport(currentListData, config);
  } else {
    exportGenericReport(currentListData, config);
  }
}

function exportGenericReport(items, config) {
  const rows = buildRows(items);
  const html = buildExcelHtml(rows, config.title);
  downloadExcel(html, config.title);
}

async function exportCourseReport(items, config) {
  const teacherMap = await loadTeachersMap();
  const mappedItems = items.map(item => {
    return {
      ...item,
      teacherName: teacherMap[item.teacherId] || `Profesor ${item.teacherId}`
    };
  }).map(({ teacherId, ...rest }) => rest);

  const rows = buildRows(mappedItems);
  const html = buildExcelHtml(rows, config.title);
  downloadExcel(html, config.title);
}

function buildRows(items) {
  const headers = Array.from(new Set(items.flatMap(item => Object.keys(item))));
  const rows = [headers];
  items.forEach(item => {
    rows.push(headers.map(header => formatValue(item[header])));
  });
  return rows;
}

function buildExcelHtml(rows, title) {
  const tableRows = rows.map(row => `  <tr>${row.map(cell => `<td>${String(cell ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>`).join("")}</tr>`).join("\n");
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title></head><body><table>${tableRows}</table></body></html>`;
}

function downloadExcel(html, title) {
  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `reporte-${title.toLowerCase().replace(/\s+/g, "-")}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function renderList(items, config) {
  listContainer.innerHTML = "";

  if (!Array.isArray(items) || items.length === 0) {
    listContainer.innerHTML = `<div class="card"><p>No hay registros disponibles para ${config.title}.</p></div>`;
    return;
  }

  items.forEach(item => {
    const card = document.createElement("article");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = `${config.title.slice(0, -1)} #${item.id}`;
    card.appendChild(title);

    Object.entries(item).forEach(([key, value]) => {
      if (key === "id") return;
      const paragraph = document.createElement("p");
      paragraph.innerHTML = `<strong>${formatLabel(key)}:</strong> ${formatValue(value)}`;
      card.appendChild(paragraph);
    });

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const editButton = document.createElement("button");
    editButton.className = "secondary";
    editButton.textContent = "Editar";
    editButton.addEventListener("click", () => populateForm(item));

    const deleteButton = document.createElement("button");
    deleteButton.className = "secondary";
    deleteButton.textContent = "Eliminar";
    deleteButton.addEventListener("click", () => deleteEntity(config, item.id));

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    card.appendChild(actions);
    listContainer.appendChild(card);
  });
}

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, str => str.toUpperCase());
}

function formatValue(value) {
  if (typeof value === "boolean") {
    return value ? "Sí" : "No";
  }
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return value;
}

async function renderDashboard() {
  const [students, courses, payments, teachers] = await Promise.all([
    fetchData(SERVICE_CONFIG.usuario.baseUrl),
    fetchData(SERVICE_CONFIG.curso.baseUrl),
    fetchData(SERVICE_CONFIG.pago.baseUrl),
    fetchData("http://localhost:8081/api/teachers")
  ]);

  const validStudents = Array.isArray(students) ? students : [];
  const validCourses = Array.isArray(courses) ? courses : [];
  const validPayments = Array.isArray(payments) ? payments : [];
  const validTeachers = Array.isArray(teachers) ? teachers : [];

  // Crear mapa de profesores por ID
  const teachersMap = validTeachers.reduce((acc, teacher) => {
    acc[teacher.id] = `${teacher.firstName} ${teacher.lastName}`;
    return acc;
  }, {});

  const paymentGroups = validPayments.reduce((acc, payment) => {
    const studentId = payment.studentId;
    if (studentId == null) return acc;
    if (!acc[studentId]) acc[studentId] = [];
    acc[studentId].push(payment);
    return acc;
  }, {});

  const pendingStudentIds = new Set();
  const currentStudentIds = new Set();
  const today = new Date();

  Object.entries(paymentGroups).forEach(([studentId, paymentsByStudent]) => {
    const hasPending = paymentsByStudent.some(payment => {
      const status = String(payment.status ?? "").toLowerCase();
      const dueDate = payment.dueDate ? new Date(payment.dueDate) : null;
      const pendingStatus = ["pending", "pendiente", "unpaid", "deudor"];
      const paidStatus = ["paid", "pagado", "completado", "pagada"];

      if (pendingStatus.some(term => status.includes(term))) return true;
      if (dueDate && dueDate < today && !paidStatus.some(term => status.includes(term))) return true;
      return false;
    });

    if (hasPending) {
      pendingStudentIds.add(studentId);
    } else {
      currentStudentIds.add(studentId);
    }
  });

  const studentsWithNoPayments = validStudents.filter(student => {
    return !paymentGroups[student.id];
  }).length;

  const totalCurrent = currentStudentIds.size + studentsWithNoPayments;

  document.getElementById("totalStudents").textContent = validStudents.length;
  document.getElementById("totalCourses").textContent = validCourses.length;
  document.getElementById("pendingStudents").textContent = pendingStudentIds.size;
  document.getElementById("currentStudents").textContent = totalCurrent;

  renderComunaPieChart(validStudents);
  renderFailingCoursesBarChart(validCourses, teachersMap);
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    return [];
  }
}

function renderComunaPieChart(students) {
  const canvas = dashboardPieCanvas;
  const legend = document.getElementById("dashboardLegend");
  const ctx = canvas.getContext("2d");
  const info = chartInfo;
  const counts = students.reduce((acc, student) => {
    const comuna = String(student.comuna || "Sin comuna").trim();
    if (!acc[comuna]) acc[comuna] = 0;
    acc[comuna] += 1;
    return acc;
  }, {});

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);
  const colors = ["#4b8cff", "#64d2ff", "#7b9cff", "#7dce8a", "#ffc069", "#ff8f6b", "#b98cff", "#63c29b", "#f5c4ff", "#5a7fff"];

  pieChartState = {
    entries,
    colors,
    total,
    selectedIndex: pieChartState.selectedIndex != null && pieChartState.selectedIndex < entries.length ? pieChartState.selectedIndex : null,
    hoverIndex: null
  };

  drawPieChart(ctx, canvas, legend, info, pieChartState);

  if (!canvas.dataset.pieEventsAttached) {
    canvas.addEventListener("mousemove", event => {
      const hoverIndex = getPieChartSegmentIndex(event, canvas, pieChartState);
      if (hoverIndex !== pieChartState.hoverIndex) {
        pieChartState.hoverIndex = hoverIndex;
        drawPieChart(ctx, canvas, legend, info, pieChartState);
      }
    });

    canvas.addEventListener("mouseout", () => {
      pieChartState.hoverIndex = null;
      drawPieChart(ctx, canvas, legend, info, pieChartState);
    });

    canvas.addEventListener("click", event => {
      const clickedIndex = getPieChartSegmentIndex(event, canvas, pieChartState);
      pieChartState.selectedIndex = clickedIndex === pieChartState.selectedIndex ? null : clickedIndex;
      drawPieChart(ctx, canvas, legend, info, pieChartState);
    });

    canvas.dataset.pieEventsAttached = "true";
  }
}

function renderFailingCoursesBarChart(courses, teachersMap = {}) {
  const canvas = dashboardBarCanvas;
  const legend = document.getElementById("dashboardBarLegend");
  const ctx = canvas.getContext("2d");
  const info = barChartInfo;

  const entries = courses
    .map(course => {
      const teacherId = course.teacherId != null ? course.teacherId : "N/A";
      const teacherName = teachersMap[teacherId] || `Profesor ${teacherId}`;
      return {
        label: course.name || `Curso ${course.id}`,
        teacherId: teacherId,
        teacherName: teacherName,
        percentage: typeof course.approvalPercentage === "number" ? Math.max(0, Math.min(100, 100 - course.approvalPercentage)) : 0,
        id: course.id
      };
    })
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 8);

  barChartState = {
    entries,
    selectedIndex: barChartState.selectedIndex != null && barChartState.selectedIndex < entries.length ? barChartState.selectedIndex : null,
    hoverIndex: null
  };

  drawBarChart(ctx, canvas, legend, info, barChartState);

  if (!canvas.dataset.barEventsAttached) {
    canvas.addEventListener("mousemove", event => {
      const hoverIndex = getBarChartIndex(event, canvas, barChartState);
      if (hoverIndex !== barChartState.hoverIndex) {
        barChartState.hoverIndex = hoverIndex;
        drawBarChart(ctx, canvas, legend, info, barChartState);
      }
    });

    canvas.addEventListener("mouseout", () => {
      barChartState.hoverIndex = null;
      drawBarChart(ctx, canvas, legend, info, barChartState);
    });

    canvas.addEventListener("click", event => {
      const clickedIndex = getBarChartIndex(event, canvas, barChartState);
      barChartState.selectedIndex = clickedIndex === barChartState.selectedIndex ? null : clickedIndex;
      drawBarChart(ctx, canvas, legend, info, barChartState);
    });

    canvas.dataset.barEventsAttached = "true";
  }
}

function drawBarChart(ctx, canvas, legend, infoBox, state) {
  const { entries, selectedIndex, hoverIndex } = state;
  const { width: displayWidth, height: displayHeight } = resizeCanvas(canvas, ctx);
  ctx.clearRect(0, 0, displayWidth, displayHeight);
  if (legend) legend.innerHTML = "";
  infoBox.textContent = "Haz clic en una barra para ver el curso y porcentaje.";

  if (!entries.length) {
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "16px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("No hay datos", displayWidth / 2, displayHeight / 2);
    return;
  }

  const padding = 56;
  const axisWidth = 32;
  const chartLeft = padding + axisWidth;
  const chartWidth = displayWidth - chartLeft - padding;
  const chartHeight = displayHeight - padding * 2;
  const maxValue = 100;
  const barWidth = chartWidth / entries.length * 0.7;
  const gap = chartWidth / entries.length * 0.3;
  const baseY = displayHeight - padding;
  const colors = ["#f97316", "#fb7185", "#6366f1", "#22c55e", "#38bdf8", "#facc15", "#a855f7", "#0ea5e9"];

  ctx.font = "12px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#475569";

  ctx.strokeStyle = "rgba(100, 116, 139, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(chartLeft, padding);
  ctx.lineTo(chartLeft, baseY);
  ctx.stroke();

  ctx.textAlign = "right";
  ctx.fillStyle = "#475569";
  for (let value = 10; value <= maxValue; value += 10) {
    const y = baseY - (value / maxValue) * chartHeight;
    ctx.fillText(`${value}`, chartLeft - 8, y + 4);

    ctx.strokeStyle = "rgba(100, 116, 139, 0.12)";
    ctx.beginPath();
    ctx.moveTo(chartLeft, y);
    ctx.lineTo(displayWidth - padding, y);
    ctx.stroke();
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#475569";

  entries.forEach((entry, index) => {
    const x = chartLeft + index * (barWidth + gap) + gap / 2 + barWidth / 2;
    const barHeight = (entry.percentage / maxValue) * chartHeight;
    const y = baseY - barHeight;
    const isSelected = index === selectedIndex;
    const isHovered = index === hoverIndex;
    const color = colors[index % colors.length];
    const borderWidth = isSelected ? 5 : isHovered ? 3 : 1;
    const strokeColor = isSelected ? "rgba(75, 140, 255, 0.9)" : "rgba(34, 55, 95, 0.4)";

    ctx.fillStyle = color;
    ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight);

    if (isSelected || isHovered) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(x - barWidth / 2, y, barWidth, barHeight);
    }

    ctx.fillStyle = "#1f2937";
    ctx.textAlign = "center";
    ctx.fillText(`${entry.percentage}%`, x, y - 10);
  });

  if (legend) {
    entries.forEach((entry, index) => {
      const legendItem = document.createElement("div");
      legendItem.className = "legend-item";
      if (index === selectedIndex) legendItem.classList.add("selected");
      legendItem.innerHTML = `
        <span class="legend-color" style="background:${colors[index % colors.length]}"></span>
        <div class="legend-meta">
          <strong>${entry.label}</strong>
          <span>${entry.teacherName}</span>
        </div>
      `;

      legendItem.addEventListener("click", () => {
        state.selectedIndex = index === selectedIndex ? null : index;
        drawBarChart(ctx, canvas, legend, infoBox, state);
      });

      legendItem.addEventListener("mouseenter", () => {
        state.hoverIndex = index;
        drawBarChart(ctx, canvas, legend, infoBox, state);
      });

      legendItem.addEventListener("mouseleave", () => {
        state.hoverIndex = null;
        drawBarChart(ctx, canvas, legend, infoBox, state);
      });

      legend.appendChild(legendItem);
    });
  }

  const activeIndex = selectedIndex != null ? selectedIndex : hoverIndex;
  if (activeIndex != null) {
    const entry = entries[activeIndex];
    infoBox.textContent = `${entry.label} · ${entry.teacherName} · ${entry.percentage}% reprobación`;
  }
}

function getBarChartIndex(event, canvas, state) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const padding = 56;
  const axisWidth = 32;
  const chartLeft = padding + axisWidth;
  const chartWidth = rect.width - chartLeft - padding;
  const entries = state.entries;
  const barWidth = chartWidth / entries.length * 0.7;
  const gap = chartWidth / entries.length * 0.3;

  for (let index = 0; index < entries.length; index++) {
    const startX = chartLeft + index * (barWidth + gap) + gap / 2;
    const endX = startX + barWidth;
    if (x >= startX && x <= endX) {
      return index;
    }
  }
  return null;
}

function drawPieChart(ctx, canvas, legend, infoBox, state) {
  const { entries, colors, total, selectedIndex, hoverIndex } = state;
  const { width: displayWidth, height: displayHeight } = resizeCanvas(canvas, ctx);
  ctx.clearRect(0, 0, displayWidth, displayHeight);
  legend.innerHTML = "";
  infoBox.textContent = "Haz clic en un segmento para ver el porcentaje.";

  if (entries.length === 0) {
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "16px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("No hay datos", displayWidth / 2, displayHeight / 2);
    return;
  }

  let startAngle = -0.5 * Math.PI;
  const centerX = displayWidth / 2;
  const centerY = displayHeight / 2;
  const radius = Math.min(displayWidth, displayHeight) / 2 - 18;

  entries.forEach(([comuna, count], index) => {
    const sliceAngle = (count / total) * 2 * Math.PI;
    const color = colors[index % colors.length];
    const isSelected = index === selectedIndex;
    const isHovered = index === hoverIndex;
    const lineWidth = isSelected ? 10 : isHovered ? 6 : 2;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    if (isSelected || isHovered) {
      ctx.strokeStyle = isSelected ? "rgba(75, 140, 255, 0.9)" : "rgba(34, 55, 95, 0.6)";
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    startAngle += sliceAngle;
  });

  const activeIndex = selectedIndex != null ? selectedIndex : hoverIndex;
  if (activeIndex != null) {
    const [comuna, count] = entries[activeIndex];
    const percentage = ((count / total) * 100).toFixed(1);
    infoBox.textContent = `${comuna}: ${count} estudiante${count !== 1 ? "s" : ""} · ${percentage}% del total`;
  }
}

function getPieChartSegmentIndex(event, canvas, state) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const dx = x - centerX;
  const dy = y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const radius = Math.min(rect.width, rect.height) / 2 - 18;

  if (distance > radius) return null;

  let angle = Math.atan2(dy, dx);
  if (angle < -0.5 * Math.PI) angle += 2 * Math.PI;

  let startAngle = -0.5 * Math.PI;
  for (let index = 0; index < state.entries.length; index++) {
    const sliceAngle = (state.entries[index][1] / state.total) * 2 * Math.PI;
    if (angle >= startAngle && angle < startAngle + sliceAngle) {
      return index;
    }
    startAngle += sliceAngle;
  }

  return state.entries.length - 1;
}

function populateForm(item) {
  entityIdInput.value = item.id;
  const config = SERVICE_CONFIG[currentServiceKey];
  config.fields.forEach(field => {
    const control = document.getElementById(field.name);
    if (!control) return;
    if (field.type === "checkbox") {
      control.checked = Boolean(item[field.name]);
    } else {
      control.value = item[field.name] ?? "";
    }
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteEntity(config, id) {
  if (!confirm(`¿Eliminar registro #${id}?`)) return;
  try {
    const response = await fetch(`${config.baseUrl}/${id}`, { method: "DELETE" });
    if (response.ok) {
      showMessage(`Registro #${id} eliminado correctamente.`, false);
      loadList(config);
      resetForm();
    } else {
      showMessage("No se pudo eliminar el registro.", true);
    }
  } catch (error) {
    showMessage("Error de conexión al eliminar el registro.", true);
  }
}

async function onSubmit(event) {
  event.preventDefault();
  const config = SERVICE_CONFIG[currentServiceKey];
  const id = entityIdInput.value.trim();
  const payload = buildPayload(config);

  if (!payload) return;

  const method = id ? "PUT" : "POST";
  const url = id ? `${config.baseUrl}/${id}` : config.baseUrl;

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      showMessage(id ? `Registro #${id} actualizado.` : `Registro creado correctamente.`, false);
      loadList(config);
      resetForm();
    } else {
      const errorPayload = await response.text();
      showMessage(`Error en el servicio: ${errorPayload}`, true);
    }
  } catch (error) {
    showMessage("No se pudo conectar con el servicio. Verifica que esté activo.", true);
  }
}

function buildPayload(config) {
  const payload = {};
  let valid = true;

  config.fields.forEach(field => {
    const control = document.getElementById(field.name);
    if (!control) return;

    if (field.type === "checkbox") {
      payload[field.name] = control.checked;
      return;
    }

    const rawValue = control.value.trim();
    if (rawValue === "") {
      payload[field.name] = null;
      return;
    }

    if (field.type === "number") {
      payload[field.name] = field.step === "0.01" ? parseFloat(rawValue) : Number(rawValue);
    } else {
      payload[field.name] = rawValue;
    }
  });

  if (currentServiceKey === "curso" && (payload.approvalPercentage < 1 || payload.approvalPercentage > 100)) {
    showMessage("El porcentaje de aprobación debe estar entre 1 y 100.", true);
    valid = false;
  }

  if (!valid) return null;
  return payload;
}

function resetForm() {
  entityIdInput.value = "";
  const config = SERVICE_CONFIG[currentServiceKey];
  config.fields.forEach(field => {
    const control = document.getElementById(field.name);
    if (!control) return;
    if (field.type === "checkbox") {
      control.checked = false;
    } else {
      control.value = "";
    }
  });
}

async function generateReport(config, item) {
  let reportItem = { ...item };

  if (currentServiceKey === "curso") {
    const teacherName = await getTeacherName(item.teacherId);
    reportItem = {
      ...reportItem,
      teacherName: teacherName || `Profesor ${item.teacherId}`
    };
    delete reportItem.teacherId;
  }

  const reportHtml = `
    <div class="report-card">
      <h4>Reporte de ${config.title.slice(0, -1)} #${item.id}</h4>
      ${Object.entries(reportItem)
        .filter(([key]) => key !== "id")
        .map(([key, value]) => `<p><strong>${formatLabel(key)}:</strong> ${formatValue(value)}</p>`)
        .join("")}
    </div>
  `;

  reportContainer.innerHTML = reportHtml;
  window.scrollTo({ top: reportContainer.offsetTop - 20, behavior: "smooth" });
}

async function getTeacherName(teacherId) {
  if (!teachersMapCache) {
    teachersMapCache = await loadTeachersMap();
  }
  return teachersMapCache[teacherId] || null;
}

async function loadTeachersMap() {
  try {
    const teachers = await fetchData("http://localhost:8081/api/teachers");
    if (!Array.isArray(teachers)) return {};
    return teachers.reduce((acc, teacher) => {
      acc[teacher.id] = `${teacher.firstName} ${teacher.lastName}`;
      return acc;
    }, {});
  } catch (error) {
    return {};
  }
}

function showMessage(message, isError = false) {
  messageBox.textContent = message;
  messageBox.style.background = isError ? "rgba(255, 110, 110, 0.12)" : "rgba(113,199,247,0.12)";
  messageBox.style.borderColor = isError ? "rgba(255, 110, 110, 0.24)" : "rgba(113,199,247,0.24)";
}

init();
