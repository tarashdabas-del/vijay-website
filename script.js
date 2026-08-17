const STORAGE_KEY = 'vijay_complaints';

  function loadComplaints(){
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return JSON.parse(raw);
    // sample starter data — feel free to delete these from the table
    const sample = [
      { date:'2026-08-10', name:'Ramesh Kumar', phone:'98765 43210', issue:'Fridge not cooling', status:'Completed' },
      { date:'2026-08-14', name:'Simran Kaur', phone:'99888 11223', issue:'AC gas refill needed', status:'In Progress' },
      { date:'2026-08-16', name:'Amit Verma', phone:'97001 22334', issue:'MCB tripping repeatedly', status:'Pending' }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
    return sample;
  }

  function saveComplaints(list){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function statusClass(status){
    if(status === 'Completed') return 'completed';
    if(status === 'In Progress') return 'progress';
    return 'pending';
  }

  function fillTable(list, bodyId, emptyId){
    const body = document.getElementById(bodyId);
    const emptyNote = document.getElementById(emptyId);
    body.innerHTML = '';

    if(list.length === 0){
      emptyNote.style.display = 'block';
    } else {
      emptyNote.style.display = 'none';
      list.slice().reverse().forEach((c, revIdx) => {
        const idx = list.length - 1 - revIdx;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="mono">${c.date}</td>
          <td>${c.name}</td>
          <td class="mono">${c.phone}</td>
          <td>${c.issue}</td>
          <td>
            <select class="mono status-select" data-idx="${idx}" style="background:var(--graphite); color:var(--paper); border:1px solid var(--line); padding:6px 8px; font-family:'JetBrains Mono',monospace; font-size:0.75rem;">
              <option value="Pending" ${c.status==='Pending'?'selected':''}>Pending</option>
              <option value="In Progress" ${c.status==='In Progress'?'selected':''}>In Progress</option>
              <option value="Completed" ${c.status==='Completed'?'selected':''}>Completed</option>
            </select>
          </td>
          <td><button class="del-btn" data-idx="${idx}">Delete</button></td>
        `;
        body.appendChild(tr);
      });
    }

    // wire up status changes
    body.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const list = loadComplaints();
        const i = parseInt(e.target.dataset.idx, 10);
        list[i].status = e.target.value;
        saveComplaints(list);
        render();
      });
    });

    // wire up delete
    body.querySelectorAll('.del-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const list = loadComplaints();
        const i = parseInt(e.target.dataset.idx, 10);
        list.splice(i, 1);
        saveComplaints(list);
        render();
      });
    });
  }

  function fillStats(list, targetId){
    const total = list.length;
    const completed = list.filter(c => c.status === 'Completed').length;
    const progress = list.filter(c => c.status === 'In Progress').length;
    const pending = list.filter(c => c.status === 'Pending').length;
    document.getElementById(targetId).innerHTML = `
      <div class="stat-cell"><div class="big">${total}</div><div class="label">Total Complaints</div></div>
      <div class="stat-cell"><div class="big amber">${pending}</div><div class="label">Pending</div></div>
      <div class="stat-cell"><div class="big ice">${progress}</div><div class="label">In Progress</div></div>
      <div class="stat-cell"><div class="big" style="color:#7CD46B;">${completed}</div><div class="label">Completed</div></div>
    `;
  }

  function render(){
    const list = loadComplaints();
    fillTable(list, 'complaintsBodyModal', 'emptyNoteModal');
    fillStats(list, 'statsRowModal');
  }

  document.getElementById('complaintForm').addEventListener('submit', function(e){
    e.preventDefault();
    const list = loadComplaints();
    list.push({
      date: new Date().toISOString().slice(0,10),
      name: document.getElementById('custName').value,
      phone: document.getElementById('custPhone').value,
      issue: document.getElementById('issue').value,
      status: document.getElementById('status').value
    });
    saveComplaints(list);
    this.reset();
    render();
  });

  document.getElementById('bookingForm').addEventListener('submit', function(e){
    e.preventDefault();
    const list = loadComplaints();
    const name = document.getElementById('bookName').value;
    const phone = document.getElementById('bookPhone').value;
    const issue = document.getElementById('bookIssue').value;
    const date = document.getElementById('bookDate').value;
    const slot = document.getElementById('bookSlot').value;

    list.push({
      date: new Date().toISOString().slice(0,10),
      name: name,
      phone: phone,
      issue: `${issue} (Slot: ${date}, ${slot})`,
      status: 'Pending'
    });
    saveComplaints(list);

    const confirmBox = document.getElementById('bookConfirm');
    confirmBox.style.display = 'block';
    confirmBox.textContent = `Thanks ${name}! Your complaint is booked for ${date}, ${slot}. We'll call you on ${phone} to confirm.`;

    this.reset();
    render();
  });

  render();
