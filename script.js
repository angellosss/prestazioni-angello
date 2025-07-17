// Dati memorizzati in localStorage per persistenza semplice
const STORAGE_KEY = 'prestazioniOdontoiatriche';

let prestazioni = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const form = document.getElementById('entryForm');
const dataInput = document.getElementById('data');
const studioSelect = document.getElementById('studio');
const pazienteInput = document.getElementById('paziente');
const prestazioneInput = document.getElementById('prestazione');
const costoInput = document.getElementById('costo');
const percentualeInput = document.getElementById('percentuale');
const guadagnoInput = document.getElementById('guadagno');
const notaInput = document.getElementById('nota');

const addBtn = document.getElementById('addBtn');
const modifyBtn = document.getElementById('modifyBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const addStudioBtn = document.getElementById('addStudioBtn');

const tableBody = document.querySelector('#prestazioniTable tbody');
const meseSelezionato = document.getElementById('meseSelezionato');
const riepilogoDiv = document.getElementById('riepilogoGuadagni');
const exportBtn = document.getElementById('exportBtn');

let editIndex = -1;

// Calcolo guadagno in base a costo e percentuale
function calcolaGuadagno() {
    const costo = parseFloat(costoInput.value);
    const percent = parseFloat(percentualeInput.value);
    if (!isNaN(costo) && !isNaN(percent)) {
        const guad = (costo * percent) / 100;
        guadagnoInput.value = guad.toFixed(2);
    } else {
        guadagnoInput.value = '';
    }
}

// Aggiorna la tabella dalla lista prestazioni
function aggiornaTabella() {
    tableBody.innerHTML = '';
    prestazioni.forEach((item, i) => {
        const tr = document.createElement('tr');

        // Checkbox pagata
        const tdPagata = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.pagata || false;
        checkbox.addEventListener('change', () => {
            prestazioni[i].pagata = checkbox.checked;
            salvaPrestazioni();
            aggiornaRiepilogo();
        });
        tdPagata.appendChild(checkbox);
        tr.appendChild(tdPagata);

        // Data
        const tdData = document.createElement('td');
        tdData.textContent = item.data;
        tr.appendChild(tdData);

        // Studio
        const tdStudio = document.createElement('td');
        tdStudio.textContent = item.studio;
        tr.appendChild(tdStudio);

        // Paziente
        const tdPaziente = document.createElement('td');
        tdPaziente.textContent = item.paziente;
        tr.appendChild(tdPaziente);

        // Prestazione
        const tdPrest = document.createElement('td');
        tdPrest.textContent = item.prestazione;
        tr.appendChild(tdPrest);

        // Costo
        const tdCosto = document.createElement('td');
        tdCosto.textContent = parseFloat(item.costo).toFixed(2);
        tr.appendChild(tdCosto);

        // Percentuale
        const tdPercent = document.createElement('td');
        tdPercent.textContent = parseFloat(item.percentuale).toFixed(2) + ' %';
        tr.appendChild(tdPercent);

        // Guadagno
        const tdGuad = document.createElement('td');
        tdGuad.textContent = parseFloat(item.guadagno).toFixed(2);
        tr.appendChild(tdGuad);

        // Nota
        const tdNota = document.createElement('td');
        tdNota.textContent = item.nota || '';
        tr.appendChild(tdNota);

        // Azioni
        const tdAzioni = document.createElement('td');
        tdAzioni.className = 'actions';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Modifica';
        editBtn.className = 'editBtn';
        editBtn.addEventListener('click', () => {
            caricaPerModifica(i);
        });
        tdAzioni.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Elimina';
        deleteBtn.className = 'deleteBtn';
        deleteBtn.addEventListener('click', () => {
            if (confirm('Sei sicuro di voler eliminare questa prestazione?')) {
                prestazioni.splice(i, 1);
                salvaPrestazioni();
                aggiornaTabella();
                aggiornaRiepilogo();
                resetForm();
            }
        });
        tdAzioni.appendChild(deleteBtn);

        tr.appendChild(tdAzioni);

        tableBody.appendChild(tr);
    });
}

// Salva su localStorage
function salvaPrestazioni() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prestazioni));
}

// Aggiunge nuova prestazione dalla form
function aggiungiPrestazione(e) {
    e.preventDefault();
    const nuovoElemento = {
        data: dataInput.value,
        studio: studioSelect.value,
        paziente: pazienteInput.value.trim(),
        prestazione: prestazioneInput.value.trim(),
        costo: parseFloat(costoInput.value),
        percentuale: parseFloat(percentualeInput.value),
        guadagno: parseFloat(guadagnoInput.value),
        nota: notaInput.value.trim(),
        pagata: false
    };

    prestazioni.push(nuovoElemento);
    salvaPrestazioni();
    aggiornaTabella();
    aggiornaRiepilogo();
    resetForm();
}

// Resetta form
function resetForm() {
    form.reset();
    guadagnoInput.value = '';
    addBtn.disabled = false;
    modifyBtn.disabled = true;
    cancelEditBtn.hidden = true;
    editIndex = -1;
}

// Carica dati nella form per modifica
function caricaPerModifica(i) {
    const item = prestazioni[i];
    dataInput.value = item.data;
    studioSelect.value = item.studio;
    pazienteInput.value = item.paziente;
    prestazioneInput.value = item.prestazione;
    costoInput.value = item.costo;
    percentualeInput.value = item.percentuale;
    guadagnoInput.value = item.guadagno.toFixed(2);
    notaInput.value = item.nota || '';

    addBtn.disabled = true;
    modifyBtn.disabled = false;
    cancelEditBtn.hidden = false;
    editIndex = i;
}

// Modifica prestazione
function modificaPrestazione() {
    if (editIndex < 0) return;

    prestazioni[editIndex].data = dataInput.value;
    prestazioni[editIndex].studio = studioSelect.value;
    prestazioni[editIndex].paziente = pazienteInput.value.trim();
    prestazioni[editIndex].prestazione = prestazioneInput.value.trim();
    prestazioni[editIndex].costo = parseFloat(costoInput.value);
    prestazioni[editIndex].percentuale = parseFloat(percentualeInput.value);
    prestazioni[editIndex].guadagno = parseFloat(guadagnoInput.value);
    prestazioni[editIndex].nota = notaInput.value.trim();

    salvaPrestazioni();
    aggiornaTabella();
    aggiornaRiepilogo();
    resetForm();
}

// Calcola guadagno in automatico al cambio costo o percentuale
costoInput.addEventListener('input', calcolaGuadagno);
percentualeInput.addEventListener('input', calcolaGuadagno);

// Gestione form submit
form.addEventListener('submit', aggiungiPrestazione);

// Bottone modifica
modifyBtn.addEventListener('click', modificaPrestazione);

// Bottone annulla modifica
cancelEditBtn.addEventListener('click', resetForm);

// Bottone aggiungi studio nuovo
addStudioBtn.addEventListener('click', () => {
    const nuovoStudio = prompt('Inserisci il nome del nuovo studio:').trim();
    if (nuovoStudio) {
        // Verifica se già esiste
        const esiste = [...studioSelect.options].some(opt => opt.value.toLowerCase() === nuovoStudio.toLowerCase());
        if (!esiste) {
            const option = document.createElement('option');
            option.value = nuovoStudio;
            option.textContent = nuovoStudio;
            studioSelect.appendChild(option);
            studioSelect.value = nuovoStudio;
        } else {
            alert('Studio già presente nella lista.');
        }
    }
});

// Funzione riepilogo mensile aggiornato in base a mese selezionato e pagata
function aggiornaRiepilogo() {
    const mese = meseSelezionato.value; // formato YYYY-MM
    if (!mese) {
        riepilogoDiv.textContent = 'Seleziona un mese per visualizzare il riepilogo.';
        return;
    }

    // Filtra prestazioni per mese e pagate
    const guadagnoTotale = prestazioni.reduce((acc, el) => {
        if (el.pagata && el.data.startsWith(mese)) {
            return acc + el.guadagno;
        }
        return acc;
    }, 0);

    riepilogoDiv.textContent = `Guadagno totale per ${mese}: €${guadagnoTotale.toFixed(2)}`;
}

// Ricalcola riepilogo al cambio mese
meseSelezionato.addEventListener('change', aggiornaRiepilogo);

// Export Excel semplice in CSV
exportBtn.addEventListener('click', () => {
    if (prestazioni.length === 0) {
        alert('Nessuna prestazione da esportare.');
        return;
    }

    const csvRows = [];

    // Header
    csvRows.push([
        'Pagata',
        'Data',
        'Studio',
        'Nome Paziente',
        'Prestazione',
        'Costo (€)',
        '% Retribuzione',
        'Guadagno (€)',
        'Nota',
    ].join(';'));

    // Dati
    prestazioni.forEach(el => {
        csvRows.push([
            el.pagata ? 'Sì' : 'No',
            el.data,
            el.studio,
            el.paziente,
            el.prestazione,
            el.costo.toFixed(2),
            el.percentuale.toFixed(2),
            el.guadagno.toFixed(2),
            el.nota ? `"${el.nota.replace(/"/g, '""')}"` : '',
        ].join(';'));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `prestazioni_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
});

// All'avvio
aggiornaTabella();
aggiornaRiepilogo();
