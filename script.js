const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');
const calendarContainer = document.getElementById('calendar-container');
const calendarElement = document.getElementById('calendar');

let isSelectingCheckin = false;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let checkinDate = null;
let checkoutDate = null;

// Open calendar when check-in or check-out input is clicked
checkinInput.addEventListener('click', () => {
    isSelectingCheckin = true;
    showCalendar();
});

checkoutInput.addEventListener('click', () => {
    isSelectingCheckin = false;
    showCalendar();
});

function showCalendar() {
    calendarContainer.classList.remove('hidden');
    renderCalendar();
}

function renderCalendar() {
    calendarElement.innerHTML = '';

    // Render current month and next month
    const months = [
        { month: currentMonth, year: currentYear },
        { month: (currentMonth + 1) % 12, year: currentMonth === 11 ? currentYear + 1 : currentYear }
    ];

    months.forEach(({ month, year }) => {
        const monthElement = createMonth(month, year);
        calendarElement.appendChild(monthElement);
    });
}

function createNavigationButtons() {
    const navButtons = document.createElement('div');
    navButtons.classList.add('navigation-buttons');

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.addEventListener('click', showPreviousMonth);
    navButtons.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', showNextMonth);
    navButtons.appendChild(nextButton);

    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear';
    clearButton.addEventListener('click', clearSelections);
    navButtons.appendChild(clearButton);

    calendarContainer.appendChild(navButtons);
}

function createMonth(month, year) {
    const monthElement = document.createElement('div');
    monthElement.classList.add('month');

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const today = new Date();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthHeader = document.createElement('div');
    monthHeader.textContent = `${monthNames[month]} ${year}`;
    monthElement.appendChild(monthHeader);

    const dayHeader = document.createElement('div');
    dayHeader.classList.add('day-header');
    dayNames.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        dayHeader.appendChild(dayElement);
    });
    monthElement.appendChild(dayHeader);

    const datesElement = document.createElement('div');
    datesElement.classList.add('dates');

    for (let i = 0; i < firstDay; i++) {
        const emptyDate = document.createElement('div');
        emptyDate.classList.add('date');
        datesElement.appendChild(emptyDate);
    }

    for (let date = 1; date <= daysInMonth; date++) {
        const dateElement = document.createElement('div');
        dateElement.classList.add('date');
        dateElement.textContent = date;

        const currentDate = new Date(year, month, date);
        if (currentDate < today.setHours(0, 0, 0, 0)) {
            dateElement.classList.add('disabled');
        } else {
            dateElement.addEventListener('click', () => selectDate(date, month, year));
        }

        // Apply highlighting based on check-in and check-out dates
        if (checkinDate && checkoutDate) {
            const checkin = new Date(checkinDate.year, checkinDate.month, checkinDate.date);
            const checkout = new Date(checkoutDate.year, checkoutDate.month, checkoutDate.date);

            if (currentDate.getTime() === checkin.getTime()) {
                dateElement.classList.add('checkin-highlight');
            } else if (currentDate.getTime() === checkout.getTime()) {
                dateElement.classList.add('checkout-highlight');
            } else if (currentDate > checkin && currentDate < checkout) {
                dateElement.classList.add('highlight');
            }
        }

        datesElement.appendChild(dateElement);
    }

    monthElement.appendChild(datesElement);

    return monthElement;
}

function selectDate(date, month, year) {
    const selectedDate = new Date(year, month, date).toLocaleDateString();

    if (isSelectingCheckin) {
        checkinInput.value = selectedDate;
        checkinDate = { date, month, year };
        checkoutDate = null; // Reset checkout date when a new check-in is selected
        checkoutInput.value = '';
    } else {
        checkoutInput.value = selectedDate;
        checkoutDate = { date, month, year };
    }

    renderCalendar(); // Re-render calendar to highlight selected dates
    // The calendar remains open for further selections
}

function showNextMonth() {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }
    renderCalendar();
}

function showPreviousMonth() {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }
    renderCalendar();
}

function clearSelections() {
    checkinInput.value = '';
    checkoutInput.value = '';
    checkinDate = null;
    checkoutDate = null;
    renderCalendar(); // render the calender
}

function createManualCloseButton() {
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.classList.add('manual-close');
    closeButton.addEventListener('click', () => {
        calendarContainer.classList.add('hidden');
    });

    calendarContainer.appendChild(closeButton);
}

createNavigationButtons();
createManualCloseButton();

document.addEventListener('click', function (event) {
    if (!calendarContainer.contains(event.target) && event.target !== checkinInput && event.target !== checkoutInput) {
        calendarContainer.classList.add('hidden');
    }
});
