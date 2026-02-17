document.addEventListener('DOMContentLoaded', () => {
	// --- Dark Mode Logic (Existing) ---
	const toggleButton = document.getElementById('toggle-dark-mode');
	const body = document.body;

	function applyDarkMode(isDark) {
		body.classList.toggle('dark-mode', isDark);
		if (toggleButton) toggleButton.textContent = isDark ? 'ライトモード' : 'ダークモード';
	}

	const saved = localStorage.getItem('darkMode');
	const prefersDark = saved === null ? false : saved === 'true';
	applyDarkMode(prefersDark);

	if (toggleButton) {
		toggleButton.addEventListener('click', () => {
			const isDark = !body.classList.contains('dark-mode');
			applyDarkMode(isDark);
			localStorage.setItem('darkMode', String(isDark));
		});
	}

	// --- Admin & Edit Mode Logic (New) ---
	const loginSection = document.getElementById('login-section');
	const adminPanel = document.getElementById('admin-panel');
	const loginBtn = document.getElementById('login-btn');
	const adminPasswordInput = document.getElementById('admin-password');
	const loginError = document.getElementById('login-error');
	const editModeBtn = document.getElementById('edit-mode-btn');
	const saveBtn = document.getElementById('save-btn');
	const logoutBtn = document.getElementById('logout-btn');

	// Admin Credentials (Simple Check)
	const ADMIN_PASSWORD = "oneway";

	// Check if already logged in
	if (localStorage.getItem('isAdmin') === 'true') {
		if (loginSection) loginSection.style.display = 'none';
		if (adminPanel) adminPanel.style.display = 'block';
	}

	if (loginBtn) {
		loginBtn.addEventListener('click', () => {
			const password = adminPasswordInput.value;
			if (password == ADMIN_PASSWORD) {
				localStorage.setItem('isAdmin', 'true');
				loginSection.style.display = 'none';
				adminPanel.style.display = 'block';
				loginError.textContent = '';
			} else {
				loginError.textContent = 'Нууц үг буруу байна!';
			}
		});
	}

	if (logoutBtn) {
		logoutBtn.addEventListener('click', () => {
			localStorage.removeItem('isAdmin');
			location.reload();
		});
	}

	// Edit Mode
	let isEditMode = false;

	if (editModeBtn) {
		editModeBtn.addEventListener('click', () => {
			isEditMode = !isEditMode;
			editModeBtn.textContent = isEditMode ? 'Засвар: ИДЭВХТЭЙ' : 'Засвар хийх';
			editModeBtn.style.backgroundColor = isEditMode ? '#e74c3c' : '';
			toggleContentEditable(isEditMode);
		});
	}

	function toggleContentEditable(enable) {
		const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, li, a:not(.delgere), figcaption');
		textElements.forEach(el => {
			if (el.closest('#login-section') || el.closest('#admin-panel') || el.closest('nav') || el.closest('script')) return;

			el.contentEditable = enable;
			if (enable) {
				el.classList.add('editable');
			} else {
				el.classList.remove('editable');
			}
		});
	}

	// Load Content Function
	function loadAllText() {
		const saved = localStorage.getItem('textContentMap');
		if (!saved) return;

		try {
			const contentMap = JSON.parse(saved);
			const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, a:not(.delgere), figcaption');
			let savedIndex = 0;

			textElements.forEach((el) => {
				if (el.closest('#login-section') || el.closest('#admin-panel') || el.closest('nav') || el.closest('script')) return;

				if (savedIndex < contentMap.length) {
					if (contentMap[savedIndex]) {
						el.innerHTML = contentMap[savedIndex];
					}
					savedIndex++;
				}
			});
		} catch (e) {
			console.error("Error loading saved content", e);
		}
	}

	// Call load on start
	loadAllText();

	// Save Content
	if (saveBtn) {
		saveBtn.addEventListener('click', () => {
			const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, a:not(.delgere), figcaption');
			const contentMap = [];

			textElements.forEach((el) => {
				if (el.closest('#login-section') || el.closest('#admin-panel') || el.closest('nav') || el.closest('script')) return;
				contentMap.push(el.innerHTML);
			});

			localStorage.setItem('textContentMap', JSON.stringify(contentMap));
			alert('Амжилттай хадгалагдлаа!');
		});
	}
});
