function validateName(name) {
    const namemethod= /^[a-zA-Z0-9]{4,20}$/;
    if (!name || name.trim() === '') {
        return { valid: false, message: 'Name is required' };
    }
    if (!namemethod.test(name)) {
        return { valid: false, message: 'name in range to 4to 20' };
    }
    return { valid: true };
}   

function validateGender(gender) {
    if (!gender) {
        return { valid: false, message: 'Gender, required' };
    }
    if (gender !== 'Male' && gender !== 'Female') {
        return { valid: false, message: 'enter valid gender' };
    }
    return { valid: true };
}
function validateDOB(dob) {
    if (!dob || dob.trim() === '') {
        return { valid: false, message: 'Dob, required' };
    }
    const datemethod = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dob.match(datemethod);
    if (!match) {
        return { valid: false, message: '  format follw' };
    }
    const month = parseInt(match[1], 10);
    const day = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);


    if (month < 1 || month > 12) {
        return { valid: false, message: 'Invalid month' };
    }
    if (day < 1 || day > 31) {
        return { valid: false, message: 'Invalid day' };
    }

    const selectedDate = new Date(year, month - 1, day);
    const today = new Date();
    if (selectedDate > today) {
        return { valid: false, message: 'not allowed check it again' };
    }
    return { valid: true, date: selectedDate };
}

function validateEmail(email) {
    if (!email || email.trim() === '') {
        return { valid: false, message: 'Email is required' };
    }
    const emailmethod = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailmethod.test(email)) {
        return { valid: false, message: 'valid email' };
    }
    return { valid: true };
}

function validatePhone(phone) {
    if (!phone || phone.trim() === '') {
        return { valid: true }; 
    }
    const phonemethod = /^\d{10}$/;
    if (!phonemethod.test(phone)) {
        return { valid: false, message: 'Phone must be exactly 10 digits' };
    }
    return { valid: true };
}
function showError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(errorId);
    if (field) {
        field.classList.add('error');
    }
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
    }
}
function clearError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(errorId);
    if (field) {
        field.classList.remove('error');
    }
    if (errorDiv) {
        errorDiv.classList.remove('show');
    }
}


function getEmployees() {
    const employees = localStorage.getItem('employees');
    return employees ? JSON.parse(employees) : [];
}
function saveEmployees(employees) {
    localStorage.setItem('employees', JSON.stringify(employees));
}
function BasicTable() {
    const employees = getEmployees();
    const tbody = document.getElementById('basicTableBody');
    if (employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No employees added yet.</td></tr>';
        return;
    }

    const columns = [
        { label: 'Name', value: emp => emp.name || '-' },
        { label: 'Gender', value: emp => emp.gender || '-' },
        { label: 'DOB', value: emp => emp.dob || '-' },

        { label: 'Email', value: emp => emp.email || '-' },
        { label: 'Phone', value: emp => emp.phone || '-' },
        { label: 'Hobbies', value: emp => (emp.hobbies && emp.hobbies.length > 0 ? emp.hobbies.join(', ') : '-') }
    ];


    tbody.innerHTML = employees.map((employee) => `
        <tr> 
            ${columns.map(col => `<td data-label="${col.label}">${escapeHtml(String(col.value(employee)))}</td>`).join('')}
        </tr>
    `).join('');
    console.log(tbody.innerHTML);
}

function AdvancedTable() { 
    
    const employees = getEmployees();
    const container = document.getElementById('advancedTableContainer');

    if (employees.length === 0) {
        container.innerHTML = '<div class="no-data">No employees added yet.</div>';
        return;
    }

    const row = [
        { label: 'Name', value: emp => emp.name || '-' },
        { label: 'Gender', value: emp => emp.gender || '-' },
        { label: 'DOB', value: emp => emp.dob || '-' },
        { label: 'Email', value: emp => emp.email || '-' },
        { label: 'Phone', value: emp => emp.phone || '-' },
        { label: 'Hobbies', value: emp => (emp.hobbies && emp.hobbies.length > 0 ? emp.hobbies.join(', ') : '-') }
    ];
    

    const rowsHtml = row.map(row => `
        <tr>
            <th>${row.label}</th>
            ${employees.map(employee => {
                const value = row.value(employee);
                const label = employee.name ? ` data-label="${escapeHtml(employee.name)}"` : '';
                return `<td${label}>${escapeHtml(String(value))}</td>`;
            }).join('')}
        </tr>
    `).join('');

    container.innerHTML = `
      <table class="advanced-table responsive-table">
            <tbody>
                ${rowsHtml}
            </tbody>
        </table>
    `;
}


function displayEmployees() {
    BasicTable();
    AdvancedTable();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}




document.getElementById('employeeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked')?.value || '';
    const dob = document.getElementById('dob').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const hobbyCheckboxes = document.querySelectorAll('input[name="hobbies"]:checked');
    const hobbies = Array.from(hobbyCheckboxes).map(cb => cb.value);

clearError('name', 'nameError');
clearError('gender', 'genderError');
clearError('dob', 'dobError');
clearError('email', 'emailError'); clearError('phone', 'phoneError');

    let isValid = true;

    const nameValidation = validateName(name);

    if (!nameValidation.valid) {
        showError('name', 'nameError', nameValidation.message);
        isValid = false;
    }
    const genderValidation = validateGender(gender);
    if (!genderValidation.valid) {
        showError('gender', 'genderError', genderValidation.message);
        isValid = false;
    }

    const dobValidation = validateDOB(dob);
    if (!dobValidation.valid) {
        showError('dob', 'dobError', dobValidation.message);
        isValid = false;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        showError('email', 'emailError', emailValidation.message);
        isValid = false;
    }

    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.valid) {
        showError('phone', 'phoneError', phoneValidation.message);
        isValid = false;
    }

    if (!isValid) {
        return;
    }
    const employee = {
        name,
        gender,
        dob: dob, 
        email,
        phone: phone || null,
        hobbies: hobbies.length > 0 ? hobbies : null
    };

    
    const employees = getEmployees();
    employees.push(employee);
    saveEmployees(employees);


    document.getElementById('gender-male').checked = true;
    document.getElementById('name').value = '';
    document.getElementById('dob').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.querySelectorAll('input[name="hobbies"]:checked').forEach(cb => cb.checked = false);
    displayEmployees();


    alert('Employee added successfully!');
});
