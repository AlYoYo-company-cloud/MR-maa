document.addEventListener("DOMContentLoaded", function () {

  /* ---------- بيانات الطلاب والمدرس ---------- */
  const defaultStudents = [
    { name: "مروان حسن", codeA: "MH1", codeB: "MH2", active: true },
    { name: "يحيى حسين", codeA: "YH1", codeB: "YH2", active: true },
    { name: "مروان طاهر", codeA: "MT1", codeB: "MT2", active: true },
    { name: "عبدالله", codeA: "AD1", codeB: "AD2", active: true },
    { name: "سارة محمد", codeA: "SM1", codeB: "SM2", active: true }
  ];

  const teacher = { username: "mohammed", password: "12345" };

  let students = JSON.parse(localStorage.getItem('students')) || defaultStudents;
  let currentStudent = JSON.parse(localStorage.getItem('currentStudent')) || null;

  // تخزين الطلاب في الـ LocalStorage
  localStorage.setItem('students', JSON.stringify(students));

  /* ---------- Dark / Light Mode ---------- */
  const toggleTheme = () => {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.className);
  };

  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.body.className = localStorage.getItem('theme') || 'dark';

  /* ---------- Utility ---------- */
  const showSection = (id) => {
    ['landing', 'studentPanel', 'teacherPanel'].forEach(section => {
      document.getElementById(section).classList.add('hidden');
    });
    document.getElementById(id).classList.remove('hidden');
  };

  /* ---------- Student Login ---------- */
  const loginStudent = (codeA, codeB) => {
    const student = students.find(s => s.codeA === codeA && s.codeB === codeB);
    if (!student) return 'الكود غير صحيح';
    if (!student.active) return 'الكود معطل';
    currentStudent = student;
    localStorage.setItem('currentStudent', JSON.stringify(student));
    document.getElementById('studentName').innerText = student.name;
    showSection('studentPanel');
    renderLessons();
    renderLeaderboard();
    return null;
  };

  /* ---------- Teacher Login ---------- */
  const loginTeacher = (username, password) => {
    if (username === teacher.username && password === teacher.password) {
      showSection('teacherPanel');
      renderStudents();
      return null;
    }
    return 'بيانات المدرس غير صحيحة';
  };

  document.getElementById('loginBtn').addEventListener('click', () => {
    const type = document.getElementById('userType').value;
    const errorMsg = document.getElementById('loginMsg');
    if (type === 'student') {
      const err = loginStudent(
        document.getElementById('studentCodeA').value.trim(),
        document.getElementById('studentCodeB').value.trim()
      );
      errorMsg.innerText = err || '';
    } else {
      const err = loginTeacher(
        document.getElementById('teacherUsername').value.trim(),
        document.getElementById('teacherPassword').value.trim()
      );
      errorMsg.innerText = err || '';
    }
  });

  /* ---------- Logout ---------- */
  document.getElementById('studentLogoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentStudent');
    showSection('landing');
  });

  document.getElementById('teacherLogoutBtn').addEventListener('click', () => {
    showSection('landing');
  });

  /* ---------- Auto Login ---------- */
  if (currentStudent) {
    document.getElementById('studentName').innerText = currentStudent.name;
    showSection('studentPanel');
    renderLessons();
    renderLeaderboard();
  }

  /* ---------- Lessons ---------- */
  const lessons = [
    { title: "حل على الدعامة في الانسان", yt: "https://www.youtube.com/embed/P_-OHiOmftg" },
    { title: "كورس التأسيس لتالته ثانوي", yt: "https://www.youtube.com/embed/VNZ1ivdGhgE" },
    { title: "الدعامة في النبات", yt: "https://www.youtube.com/embed/ocYoCZesMmA" }
  ];

  const renderLessons = () => {
    const list = document.getElementById('lessonsContainer');
    list.innerHTML = '';
    lessons.forEach((lesson, index) => {
      const btn = document.createElement('button');
      btn.className = 'lessonBtn';
      btn.dataset.index = index;
      btn.innerText = lesson.title;
      list.appendChild(btn);
    });
  };

  document.getElementById('lessonsContainer').addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('lessonBtn')) {
      const idx = e.target.dataset.index;
      const videoContainer = document.getElementById('lessonVideo');
      videoContainer.innerHTML = `<iframe src="${lessons[idx].yt}" allowfullscreen></iframe>`;
      videoContainer.classList.remove('hidden');
      videoContainer.scrollIntoView({ behavior: 'smooth' });
    }
  });

  /* ---------- Leaderboard ---------- */
  const renderLeaderboard = () => {
    const container = document.getElementById('leaderboardContainer');
    container.innerHTML = '';
    students.forEach((student, index) => {
      container.innerHTML += `<div>${index + 1}. ${student.name}</div>`;
    });
  };

  /* ---------- Student Nav ---------- */
  document.getElementById('showLessonsBtn').addEventListener('click', () => {
    document.getElementById('lessonsContainer').classList.remove('hidden');
    document.getElementById('leaderboardContainer').classList.add('hidden');
  });

  document.getElementById('showLeaderboardBtn').addEventListener('click', () => {
    document.getElementById('leaderboardContainer').classList.remove('hidden');
    document.getElementById('lessonsContainer').classList.add('hidden');
  });

  /* ---------- Teacher ---------- */
  const renderStudents = () => {
    const list = document.getElementById('studentsList');
    list.innerHTML = '';
    students.forEach((student, index) => {
      list.innerHTML += `
        <div>
          ${student.name} | ${student.codeA} - ${student.codeB}
          <button onclick="toggleStudent(${index})">
            ${student.active ? 'إيقاف' : 'تفعيل'}
          </button>
        </div>`;
    });
  };

  window.toggleStudent = (index) => {
    students[index].active = !students[index].active;
    localStorage.setItem('students', JSON.stringify(students));
    renderStudents();
  };

  /* ---------- Add New Student (Teacher) ---------- */
  document.getElementById('addStudentBtn').addEventListener('click', () => {
    const studentName = document.getElementById('newStudentName').value.trim();
    if (studentName) {
      const newStudent = {
        name: studentName,
        codeA: Math.random().toString(36).substring(2, 8).toUpperCase(),
        codeB: Math.random().toString(36).substring(2, 8).toUpperCase(),
        active: true
      };
      students.push(newStudent);
      localStorage.setItem('students', JSON.stringify(students));
      renderStudents();
    }
  });

  /* ---------- Add Lesson (Teacher) ---------- */
  document.getElementById('addLessonBtn').addEventListener('click', () => {
    const title = document.getElementById('lessonTitle').value.trim();
    const yt = document.getElementById('lessonYouTube').value.trim();
    const form = document.getElementById('lessonForm').value.trim();
    if (title && yt && form) {
      lessons.push({ title, yt, form });
      renderLessons();
    }
  });

});
