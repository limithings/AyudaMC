const app = {
    data: {
        passwords: [],
        consumables: [],
        myzone: [],
        avisos: [],
        tareas: [],
        ot_consumables: [],
        recuerdos: [],
        diccionario: [],
        ronda: {}
    },
    state: {
        currentAction: null,
        currentItemId: null,
        isAuthenticated: false,
        isDrawing: false,
        ctx: null,
        canvas: null,
        lastX: 0,
        lastY: 0
    },

    init: function() {
        const DATA_VERSION = "1.5"; 
        const storedVersion = localStorage.getItem('ayudamc_version');

        if (storedVersion !== DATA_VERSION) {
            console.log("New version detected. Resetting data to defaults.");
            this.data.passwords = defaultPasswords;
            this.data.consumables = defaultConsumables;
            this.data.myzone = defaultMyZone;
            this.data.avisos = defaultAvisos;
            this.data.tareas = defaultTareas;
            this.data.ot_consumables = defaultOTConsumables;
            this.data.recuerdos = defaultRecuerdos; 
            this.data.diccionario = defaultDiccionario;
            
            this.data.ronda = JSON.parse(localStorage.getItem('ayudamc_ronda')) || {};

            this.saveAll();
            localStorage.setItem('ayudamc_version', DATA_VERSION);
        } else {
            this.data.passwords = JSON.parse(localStorage.getItem('ayudamc_passwords')) || defaultPasswords;
            this.data.consumables = JSON.parse(localStorage.getItem('ayudamc_consumables')) || defaultConsumables;
            this.data.myzone = JSON.parse(localStorage.getItem('ayudamc_myzone')) || defaultMyZone;
            this.data.avisos = JSON.parse(localStorage.getItem('ayudamc_avisos')) || defaultAvisos;
            this.data.tareas = JSON.parse(localStorage.getItem('ayudamc_tareas')) || defaultTareas;
            this.data.ot_consumables = JSON.parse(localStorage.getItem('ayudamc_ot_consumables')) || defaultOTConsumables;
            this.data.recuerdos = JSON.parse(localStorage.getItem('ayudamc_recuerdos')) || defaultRecuerdos;
            this.data.diccionario = JSON.parse(localStorage.getItem('ayudamc_diccionario')) || defaultDiccionario;
            this.data.ronda = JSON.parse(localStorage.getItem('ayudamc_ronda')) || {};
        }

        this.renderPasswords();
        this.renderConsumables();
        this.renderMyZone();
        this.renderAvisos();
        this.renderTareas();
        this.renderOTConsumables();
        this.renderRecuerdos();
        this.renderDiccionario();
        this.loadRonda();

        // Check License at end of init
        this.checkLicense();
    },

    // --- HELPER FOR GENERIC MODALS ---
    openModal: function(id) {
        document.getElementById(id).classList.add('active');
    },

    // --- BACKUP SYSTEM ---
    exportData: function() {
        const dataStr = JSON.stringify(this.data);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'copia_seguridad_ayudamc.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    },

    importData: function() {
        const fileInput = document.getElementById('backup-file');
        const file = fileInput.files[0];
        
        if (!file) {
            alert("Selecciona un archivo primero.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Validate structure roughly
                if (importedData.passwords && importedData.consumables) {
                    this.data = importedData;
                    this.saveAll();
                    alert("✅ Datos restaurados con éxito. La aplicación se reiniciará.");
                    location.reload();
                } else {
                    alert("❌ Archivo no válido (formato incorrecto).");
                }
            } catch (err) {
                alert("❌ Error al leer el archivo.");
            }
        };
        reader.readAsText(file);
    },

    // --- LICENSE SYSTEM ---
    checkLicense: function() {
        // 1. Get or Generate Device ID
        let deviceId = localStorage.getItem('ayudamc_device_id');
        if (!deviceId) {
            deviceId = Math.floor(100000 + Math.random() * 900000); // Random 6 digit
            localStorage.setItem('ayudamc_device_id', deviceId);
        }
        
        // 2. Check if already activated
        const isActivated = localStorage.getItem('ayudamc_activated') === 'true';

        if (!isActivated) {
            // Show Lock Screen with ID
            document.getElementById('device-id-display').innerText = deviceId;
            document.getElementById('lock-modal').classList.add('active');
        }
    },

    validateLicense: function() {
        const deviceId = parseInt(localStorage.getItem('ayudamc_device_id'));
        const inputKey = parseInt(document.getElementById('license-key').value);
        
        // ALGORITHM: (ID * 2) + 777
        const validKey = (deviceId * 2) + 777;

        if (inputKey === validKey) {
            localStorage.setItem('ayudamc_activated', 'true');
            document.getElementById('lock-modal').classList.remove('active');
            alert('✅ Dispositivo Autorizado. Acceso permanente concedido.');
        } else {
            alert('⛔ Código incorrecto para este dispositivo.');
        }
    },

    saveAll: function() {
        localStorage.setItem('ayudamc_passwords', JSON.stringify(this.data.passwords));
        localStorage.setItem('ayudamc_consumables', JSON.stringify(this.data.consumables));
        localStorage.setItem('ayudamc_myzone', JSON.stringify(this.data.myzone));
        localStorage.setItem('ayudamc_avisos', JSON.stringify(this.data.avisos));
        localStorage.setItem('ayudamc_tareas', JSON.stringify(this.data.tareas));
        localStorage.setItem('ayudamc_ot_consumables', JSON.stringify(this.data.ot_consumables));
        localStorage.setItem('ayudamc_recuerdos', JSON.stringify(this.data.recuerdos));
        localStorage.setItem('ayudamc_diccionario', JSON.stringify(this.data.diccionario));
    },

    // --- NAVIGATION ---
    openTab: function(tabId) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if(btn.getAttribute('onclick').includes(tabId)) {
                btn.classList.add('active');
            }
        });
    },

    // --- RENDERERS ---
    renderPasswords: function(filterText = '') {
        const list = document.getElementById('password-list');
        list.innerHTML = '';
        let sorted = [...this.data.passwords].sort((a,b) => a.order - b.order);
        const filtered = sorted.filter(item => {
            const searchStr = (item.team + item.user + item.pass).toLowerCase();
            return searchStr.includes(filterText.toLowerCase());
        });
        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div class="card-header">
                    <span class="card-title">${item.team}</span>
                    <button class="copy-btn" onclick="app.promptAuth('editPassword', ${item.id})">✏️</button>
                </div>
                <div class="card-detail"><span style="color:var(--text-secondary)">Usu:</span> ${item.user}</div>
                <div class="card-detail"><span style="color:var(--text-secondary)">Pass:</span> <span class="gold-text">${item.pass}</span></div>
            `;
            list.appendChild(card);
        });
    },

    renderConsumables: function(filterText = '') {
        const list = document.getElementById('consumables-list');
        list.innerHTML = ''; 
        let items = this.data.consumables;
        if (filterText) items = items.filter(item => (item.code + item.desc).toLowerCase().includes(filterText.toLowerCase()));
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div class="card-header">
                    <span class="card-title">${item.code}</span>
                    <button class="copy-btn" onclick="app.promptAuth('editConsumable', '${item.code}')">✏️</button>
                </div>
                <div class="card-detail">${item.desc}</div>
            `;
            list.appendChild(card);
        });
    },

    renderMyZone: function() {
        const list = document.getElementById('myzone-list');
        list.innerHTML = '';
        this.data.myzone.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'item-card zone-card';
            card.innerHTML = `
                <div class="card-header">
                    <span class="card-title">${item.service}</span>
                    <button class="copy-btn" onclick="app.promptAuth('editMyZone', ${index})">✏️</button>
                </div>
                <div class="card-detail">User: ${item.user}</div>
                <div class="card-detail">Pass: ${item.pass}</div>
            `;
            list.appendChild(card);
        });
    },

    renderAvisos: function() {
        const list = document.getElementById('avisos-list');
        list.innerHTML = '';
        this.data.avisos.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.style.borderLeft = '3px solid #ff9f43';
            card.innerHTML = `
                <div class="card-header">
                    <span class="card-title">${item.equipo}</span>
                    <div>
                        <button class="copy-btn" onclick="app.promptAuth('editAviso', ${item.id})" style="margin-right:10px">✏️</button>
                        <button class="copy-btn" onclick="app.deleteItem('avisos', ${item.id})" style="color:var(--accent-critical)">X</button>
                    </div>
                </div>
                <div class="card-detail"><span style="color:var(--text-secondary)">Prob:</span> ${item.problema}</div>
                <div class="card-detail"><span style="color:var(--text-secondary)">Com:</span> ${item.coment}</div>
                <div class="card-detail" style="font-size:11px; margin-top:5px; text-align:right; opacity:0.7">${item.fecha}</div>
            `;
            list.appendChild(card);
        });
    },

    renderTareas: function() {
        const list = document.getElementById('tareas-list');
        list.innerHTML = '';
        this.data.tareas.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.style.borderLeft = '3px solid #1dd1a1';
            card.innerHTML = `
                <div class="card-header">
                    <span class="card-title">${item.tarea}</span>
                    <div>
                        <button class="copy-btn" onclick="app.promptAuth('editTarea', ${item.id})" style="margin-right:10px">✏️</button>
                        <button class="copy-btn" onclick="app.deleteItem('tareas', ${item.id})" style="color:var(--accent-critical)">X</button>
                    </div>
                </div>
                <div class="card-detail"><span style="color:var(--text-secondary)">Tiempo:</span> ${item.tiempo}</div>
                <div class="card-detail"><span style="color:var(--text-secondary)">Inicio:</span> ${item.inicio}</div>
                <div class="card-detail" style="font-size:11px; margin-top:5px; text-align:right; opacity:0.7">${item.fecha}</div>
            `;
            list.appendChild(card);
        });
    },

    renderOTConsumables: function() {
        const list = document.getElementById('ot-consumables-list');
        list.innerHTML = '';
        let sorted = [...this.data.ot_consumables].sort((a,b) => a.order - b.order);
        sorted.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div class="card-header">
                    <span class="card-title">${item.name}</span>
                    <button class="copy-btn" onclick="app.promptAuth('editOTConsumable', ${item.id})">✏️</button>
                </div>
                <div class="card-detail"><span style="color:var(--text-secondary)">Code:</span> <span class="gold-text" style="font-size:1.1em">${item.code}</span></div>
            `;
            list.appendChild(card);
        });
    },

    renderRecuerdos: function(filterText = '') {
        const list = document.getElementById('recuerdos-list');
        list.innerHTML = '';
        let items = this.data.recuerdos;
        if (filterText) {
            items = items.filter(item => 
                (item.category + item.title + item.desc).toLowerCase().includes(filterText.toLowerCase())
            );
        }
        const grouped = {};
        items.forEach(item => {
            if(!grouped[item.category]) grouped[item.category] = [];
            grouped[item.category].push(item);
        });
        Object.keys(grouped).forEach(cat => {
            const groupHeader = document.createElement('div');
            groupHeader.className = 'recuerdo-group-title';
            groupHeader.innerText = cat; 
            list.appendChild(groupHeader);
            grouped[cat].forEach(item => {
                const card = document.createElement('div');
                card.className = 'item-card recuerdo-card';
                card.innerHTML = `
                    <div class="card-header">
                        <span class="card-title">${item.title}</span> 
                        <div>
                        <button class="copy-btn" onclick="app.promptAuth('editRecuerdo', ${item.id})" style="margin-right:10px">✏️</button>
                        <button class="copy-btn" onclick="app.deleteItem('recuerdos', ${item.id})" style="color:var(--accent-critical)">X</button>
                        </div>
                    </div>
                    <div class="card-detail">${item.desc}</div>
                    ${item.image ? `<img src="${item.image}" class="image-preview" onclick="app.viewImage('${item.image}')">` : ''}
                `;
                list.appendChild(card);
            });
        });
    },

    renderDiccionario: function(filterText = '') {
        const list = document.getElementById('diccionario-list');
        list.innerHTML = '';
        let items = this.data.diccionario;
        if (filterText) items = items.filter(item => (item.name + item.tag + item.desc).toLowerCase().includes(filterText.toLowerCase()));
        
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.style.borderLeft = '3px solid #0abde3'; // Light blue for diccionario
            card.innerHTML = `
                <div class="card-header">
                    <span class="card-title">${item.name}</span>
                    <div>
                        <button class="copy-btn" onclick="app.promptAuth('editDiccionario', ${item.id})" style="margin-right:10px">✏️</button>
                        <button class="copy-btn" onclick="app.deleteItem('diccionario', ${item.id})" style="color:var(--accent-critical)">X</button>
                    </div>
                </div>
                <div class="card-detail"><span style="color:var(--accent-teal); font-weight:bold;">${item.tag}</span></div>
                <div class="card-detail" style="margin-top:5px;">${item.desc}</div>
            `;
            list.appendChild(card);
        });
    },

    filterRecuerdos: function(val) { this.renderRecuerdos(val); },
    filterDiccionario: function(val) { this.renderDiccionario(val); },

    // --- FILTERS ---
    filterPasswords: function(val) { this.renderPasswords(val); },
    filterConsumables: function(val) { this.renderConsumables(val); },

    loadRonda: function() {
        if (!this.data.ronda) return;
        Object.keys(this.data.ronda).forEach(key => {
            const el = document.getElementById(key);
            if(el) el.value = this.data.ronda[key];
        });
    },

    saveRonda: function() {
        const inputs = document.querySelectorAll('.ronda-val');
        inputs.forEach(input => {
            this.data.ronda[input.id] = input.value;
        });
        localStorage.setItem('ayudamc_ronda', JSON.stringify(this.data.ronda));
    },

    promptAuth: function(action, id = null) {
        this.state.currentAction = action;
        this.state.currentItemId = id;
        
        if (action.includes('Aviso') || action.includes('Tarea') || action.includes('MyZone') || action.includes('OTConsumable') || action.includes('Recuerdo') || action.includes('Diccionario')) {
            this.openEditor();
            return;
        }

        document.getElementById('auth-user').value = '';
        document.getElementById('auth-pass').value = '';
        document.getElementById('auth-modal').classList.add('active');
        document.getElementById('auth-user').focus();
    },

    checkAuth: function() {
        const u = document.getElementById('auth-user').value;
        const p = document.getElementById('auth-pass').value;

        if (u === 'control' && p === 'tirme2') {
            this.state.isAuthenticated = true;
            this.closeModal('auth-modal');
            this.openEditor();
        } else {
            alert('Credenciales incorrectas');
        }
    },

    deleteItem: function(type, id) {
        if (confirm("¿Estás seguro de eliminar este elemento?")) {
            let action = 'delete' + (type.charAt(0).toUpperCase() + type.slice(1)); // Capitalize
            if(type === 'avisos') action = 'deleteAviso'; 
            if(type === 'tareas') action = 'deleteTarea';
            // for 'recuerdos' it becomes 'deleteRecuerdos' which is wrong in previous map, let's fix
            if(type === 'recuerdos') action = 'deleteRecuerdo';
            if(type === 'diccionario') action = 'deleteDiccionario';

            this.promptAuth(action, id);
        }
    },

    performDelete: function() {
        const action = this.state.currentAction;
        const id = this.state.currentItemId;
        
        if (action === 'deleteAviso') {
            this.data.avisos = this.data.avisos.filter(x => x.id !== id);
            this.renderAvisos();
        } else if (action === 'deleteTarea') {
            this.data.tareas = this.data.tareas.filter(x => x.id !== id);
            this.renderTareas();
        } else if (action === 'deleteRecuerdo') {
            this.data.recuerdos = this.data.recuerdos.filter(x => x.id !== id);
            this.renderRecuerdos();
        } else if (action === 'deleteDiccionario') {
            this.data.diccionario = this.data.diccionario.filter(x => x.id !== id);
            this.renderDiccionario();
        }
        this.saveAll();
        this.closeModal('editor-modal'); 
    },

    // --- CANVAS DRAWING ---
    initCanvas: function(existingImageSrc = null) {
        this.state.canvas = document.getElementById('drawing-canvas');
        this.state.ctx = this.state.canvas.getContext('2d');
        const ctx = this.state.ctx;
        
        ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;

        if (existingImageSrc) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, 300, 300); 
            };
            img.src = existingImageSrc;
        }

        const startDraw = (e) => {
            this.state.isDrawing = true;
            const rect = this.state.canvas.getBoundingClientRect();
            this.state.lastX = (e.clientX || e.touches[0].clientX) - rect.left;
            this.state.lastY = (e.clientY || e.touches[0].clientY) - rect.top;
        };
        const draw = (e) => {
            if (!this.state.isDrawing) return;
            const rect = this.state.canvas.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;
            
            ctx.beginPath();
            ctx.moveTo(this.state.lastX, this.state.lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
            
            this.state.lastX = x;
            this.state.lastY = y;
        };
        const endDraw = () => this.state.isDrawing = false;

        this.state.canvas.addEventListener('mousedown', startDraw);
        this.state.canvas.addEventListener('mousemove', draw);
        this.state.canvas.addEventListener('mouseup', endDraw);
        this.state.canvas.addEventListener('touchstart', startDraw);
        this.state.canvas.addEventListener('touchmove', draw);
        this.state.canvas.addEventListener('touchend', endDraw);
    },

    handleImageUpload: function(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const ctx = this.state.ctx;
                    ctx.clearRect(0, 0, 300, 300);
                    ctx.drawImage(img, 0, 0, 300, 300);
                }
                img.src = e.target.result;
            }
            reader.readAsDataURL(input.files[0]);
        }
    },

    clearCanvas: function() {
        this.state.ctx.clearRect(0, 0, 300, 300);
    },

    openEditor: function() {
        const action = this.state.currentAction;
        
        if (action.startsWith('delete')) {
            this.performDelete();
            return;
        }

        const modal = document.getElementById('editor-modal');
        const fields = document.getElementById('editor-fields');
        const title = document.getElementById('editor-title');
        
        fields.innerHTML = '';
        const id = this.state.currentItemId;

        // ... Existing editor blocks ... 
        if (action.includes('Password')) {
             title.textContent = action === 'addPassword' ? 'Nueva Contraseña' : 'Editar Contraseña';
             const item = id ? this.data.passwords.find(x => x.id === id) : { team: '', user: '', pass: '', order: 99 };
             fields.innerHTML = `
                <div class="form-group"><label class="form-label">Equipo</label><input type="text" id="edit-team" class="form-input" value="${item.team}"></div>
                <div class="form-group"><label class="form-label">Usuario</label><input type="text" id="edit-user" class="form-input" value="${item.user}"></div>
                <div class="form-group"><label class="form-label">Contraseña</label><input type="text" id="edit-pass" class="form-input" value="${item.pass}"></div>
                <div class="form-group"><label class="form-label">Orden</label><input type="number" id="edit-order" class="form-input" value="${item.order}"></div>`;
        } else if (action.includes('OTConsumable')) {
             title.textContent = 'OT Consumible';
             const item = id ? this.data.ot_consumables.find(x => x.id === id) : { name: '', code: '', order: 99 };
             fields.innerHTML = `
                <div class="form-group"><label class="form-label">Apartado</label><input type="text" id="edit-ot-name" class="form-input" value="${item.name}"></div>
                <div class="form-group"><label class="form-label">Código</label><input type="text" id="edit-ot-code" class="form-input" value="${item.code}"></div>
                <div class="form-group"><label class="form-label">Orden</label><input type="number" id="edit-ot-order" class="form-input" value="${item.order}"></div>`;
        } else if (action.includes('Consumable')) {
             title.textContent = 'Editar Consumible';
             const item = id ? this.data.consumables.find(x => x.code === id) : { code: '', desc: '' };
             fields.innerHTML = `
                <div class="form-group"><label class="form-label">Código</label><input type="text" id="edit-code" class="form-input" value="${item.code}" ${id ? 'disabled' : ''}></div>
                <div class="form-group"><label class="form-label">Descripción</label><textarea id="edit-desc" class="form-input" rows="3">${item.desc}</textarea></div>`;
        } else if (action.includes('MyZone')) {
             title.textContent = 'Editar Mi Zona';
             const item = (id !== null) ? this.data.myzone[id] : { service: '', user: '', pass: '' };
             fields.innerHTML = `
                <div class="form-group"><label class="form-label">Servicio</label><input type="text" id="edit-service" class="form-input" value="${item.service}"></div>
                <div class="form-group"><label class="form-label">Usuario</label><input type="text" id="edit-mz-user" class="form-input" value="${item.user}"></div>
                <div class="form-group"><label class="form-label">Contraseña</label><input type="text" id="edit-mz-pass" class="form-input" value="${item.pass}"></div>`;
        } else if (action.includes('Aviso')) {
             title.textContent = 'Aviso';
             const item = id ? this.data.avisos.find(x => x.id === id) : { equipo: '', problema: '', coment: '' };
             fields.innerHTML = `
                <div class="form-group"><label class="form-label">Equipo</label><input type="text" id="edit-avi-team" class="form-input" value="${item.equipo}"></div>
                <div class="form-group"><label class="form-label">Problema</label><input type="text" id="edit-avi-prob" class="form-input" value="${item.problema}"></div>
                <div class="form-group"><label class="form-label">Comentario</label><input type="text" id="edit-avi-com" class="form-input" value="${item.coment}"></div>`;
        } else if (action.includes('Tarea')) {
             title.textContent = 'Tarea';
             const item = id ? this.data.tareas.find(x => x.id === id) : { tarea: '', tiempo: '', inicio: '' };
             fields.innerHTML = `
                <div class="form-group"><label class="form-label">Tarea</label><input type="text" id="edit-tar-desc" class="form-input" value="${item.tarea}"></div>
                <div class="form-group"><label class="form-label">Tiempo</label><input type="text" id="edit-tar-time" class="form-input" value="${item.tiempo}"></div>
                <div class="form-group"><label class="form-label">Hora Inicio</label><input type="time" id="edit-tar-ini" class="form-input" value="${item.inicio}"></div>`;
        } else if (action.includes('Recuerdo')) {
             title.textContent = 'Recuerdo / Foto';
             const item = id ? this.data.recuerdos.find(x => x.id === id) : { category: '', title: '', desc: '', image: '' };
             fields.innerHTML = `
                <div class="form-group"><label class="form-label">Categoría</label><input type="text" id="edit-rec-cat" class="form-input" value="${item.category}" placeholder="Ejem: Motor 3, Pesaje..."></div>
                <div class="form-group"><label class="form-label">Título</label><input type="text" id="edit-rec-title" class="form-input" value="${item.title}" placeholder="Breve título..."></div>
                <div class="form-group"><label class="form-label">Descripción</label><textarea id="edit-rec-desc" class="form-input" rows="2">${item.desc}</textarea></div>
                <div class="form-group"><label class="form-label">Imagen (Subir)</label><input type="file" id="edit-rec-file" class="form-input" accept="image/*" onchange="app.handleImageUpload(this)"></div>
                <div class="canvas-container"><canvas id="drawing-canvas" width="300" height="300"></canvas></div>
                <div class="canvas-controls"><button class="control-btn" onclick="app.clearCanvas()">Borrar Dibujo</button><span style="font-size:10px; color:#aaa; align-self:center">Dibuja encima</span></div>`;
             setTimeout(() => { this.initCanvas(item.image); }, 100);
        } else if (action.includes('Diccionario')) {
             title.textContent = 'Elemento de Diccionario';
             const item = id ? this.data.diccionario.find(x => x.id === id) : { name: '', tag: '', desc: '' };
             fields.innerHTML = `
                <div class="form-group"><label class="form-label">Nombre</label><input type="text" id="edit-dic-name" class="form-input" value="${item.name}"></div>
                <div class="form-group"><label class="form-label">Tag / Código</label><input type="text" id="edit-dic-tag" class="form-input" value="${item.tag}"></div>
                <div class="form-group"><label class="form-label">Descripción</label><textarea id="edit-dic-desc" class="form-input" rows="3">${item.desc}</textarea></div>`;
        }

        modal.classList.add('active');
    },

    saveItem: function() {
        const action = this.state.currentAction;
        const id = this.state.currentItemId;
        const now = new Date();
        const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString().slice(0,5);
        const dateOnlyStr = now.toLocaleDateString();

        if (action.includes('Password')) {
            const team = document.getElementById('edit-team').value;
            const user = document.getElementById('edit-user').value;
            const pass = document.getElementById('edit-pass').value;
            const order = parseInt(document.getElementById('edit-order').value) || 99;
            if (action === 'addPassword') this.data.passwords.push({ id: Date.now(), team, user, pass, order });
            else { const i = this.data.passwords.find(x => x.id === id); if(i) { i.team = team; i.user = user; i.pass = pass; i.order = order; } }
            this.renderPasswords();
        }
        else if (action.includes('Consumable')) {
            const code = document.getElementById('edit-code').value;
            const desc = document.getElementById('edit-desc').value;
            if (action === 'addConsumable') this.data.consumables.push({ code, desc });
            else { const i = this.data.consumables.find(x => x.code === id); if(i) i.desc = desc; }
            this.renderConsumables();
        }
        else if (action.includes('MyZone')) {
            const service = document.getElementById('edit-service').value;
            const user = document.getElementById('edit-mz-user').value;
            const pass = document.getElementById('edit-mz-pass').value;
            if (action === 'addMyZone') this.data.myzone.push({ service, user, pass });
            else this.data.myzone[id] = { service, user, pass };
            this.renderMyZone();
        }
        else if (action.includes('Aviso')) {
            const equipo = document.getElementById('edit-avi-team').value;
            const problema = document.getElementById('edit-avi-prob').value;
            const coment = document.getElementById('edit-avi-com').value;
            if (action === 'addAviso') this.data.avisos.push({ id: Date.now(), equipo, problema, coment, fecha: dateStr });
            else { const i = this.data.avisos.find(x => x.id === id); if(i) { i.equipo = equipo; i.problema = problema; i.coment = coment; } }
            this.renderAvisos();
        }
        else if (action.includes('Tarea')) {
            const tarea = document.getElementById('edit-tar-desc').value;
            const tiempo = document.getElementById('edit-tar-time').value;
            const inicio = document.getElementById('edit-tar-ini').value;
            if (action === 'addTarea') this.data.tareas.push({ id: Date.now(), tarea, tiempo, inicio, fecha: dateOnlyStr });
            else { const i = this.data.tareas.find(x => x.id === id); if(i) { i.tarea = tarea; i.tiempo = tiempo; i.inicio = inicio; } }
            this.renderTareas();
        }
        else if (action.includes('OTConsumable')) {
            const name = document.getElementById('edit-ot-name').value;
            const code = document.getElementById('edit-ot-code').value;
            const order = parseInt(document.getElementById('edit-ot-order').value) || 99;
            if (action === 'addOTConsumable') this.data.ot_consumables.push({ id: Date.now(), name, code, order });
            else { const i = this.data.ot_consumables.find(x => x.id === id); if(i) { i.name = name; i.code = code; i.order = order; } }
            this.renderOTConsumables();
        }
        else if (action.includes('Recuerdo')) {
            const cat = document.getElementById('edit-rec-cat').value;
            const title = document.getElementById('edit-rec-title').value;
            const desc = document.getElementById('edit-rec-desc').value;
            const image = this.state.canvas.toDataURL('image/jpeg', 0.7);

            if (action === 'addRecuerdo') this.data.recuerdos.push({ id: Date.now(), category: cat, title, desc, image });
            else { const i = this.data.recuerdos.find(x => x.id === id); if(i) { i.category = cat; i.title = title; i.desc = desc; i.image = image; } }
            this.renderRecuerdos();
        }
        else if (action.includes('Diccionario')) {
            const name = document.getElementById('edit-dic-name').value;
            const tag = document.getElementById('edit-dic-tag').value;
            const desc = document.getElementById('edit-dic-desc').value;

            if (action === 'addDiccionario') this.data.diccionario.push({ id: Date.now(), name, tag, desc });
            else { const i = this.data.diccionario.find(x => x.id === id); if(i) { i.name = name; i.tag = tag; i.desc = desc; } }
            this.renderDiccionario();
        }

        this.saveAll();
        this.closeModal('editor-modal');
    },

    closeModal: function(modalId) {
        document.getElementById(modalId).classList.remove('active');
    },
    viewImage: function(src) { }
};

app.init();
