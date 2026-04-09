/* ============================================================
   NOTES.JS — "Mes notes" sidebar — save/copy tips
   ============================================================ */

let savedNotes = [];

export function initNotes() {
  const sidebar      = document.getElementById('notes-sidebar');
  const toggleBtn    = document.querySelector('.notes-toggle');
  const closeBtn     = document.querySelector('.sidebar-close');
  const copyBtn      = document.querySelector('.btn-copy');
  const sidebarBody  = document.querySelector('.sidebar-body');
  const badge        = document.querySelector('.notes-badge');

  if (!sidebar) return;

  // ── Toggle Sidebar ───────────────────────────────────────
  function openSidebar() {
    sidebar.classList.add('open');
    sidebar.setAttribute('aria-hidden', 'false');
    if (closeBtn) closeBtn.focus();
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebar.setAttribute('aria-hidden', 'true');
    if (toggleBtn) toggleBtn.focus();
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSidebar);
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });

  // ── Add Note ─────────────────────────────────────────────
  window.addNote = function(tipNumber, tipTitle, tipText) {
    // Avoid duplicates
    const exists = savedNotes.some(n => n.number === tipNumber);
    if (exists) {
      // If already saved, remove it (toggle)
      removeNote(tipNumber);
      return;
    }

    savedNotes.push({ number: tipNumber, title: tipTitle, text: tipText });
    renderNotes();
    updateBadge();
    openSidebar();

    // Update button state
    const btn = document.querySelector(`[data-tip="${tipNumber}"]`);
    if (btn) {
      btn.classList.add('saved');
      btn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Noté !
      `;
    }
  };

  // ── Remove Note ───────────────────────────────────────────
  function removeNote(tipNumber) {
    savedNotes = savedNotes.filter(n => n.number !== tipNumber);
    renderNotes();
    updateBadge();

    // Reset button state
    const btn = document.querySelector(`[data-tip="${tipNumber}"]`);
    if (btn) {
      btn.classList.remove('saved');
      btn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Je note ça !
      `;
    }
  }

  // ── Render Notes ─────────────────────────────────────────
  function renderNotes() {
    if (!sidebarBody) return;

    if (savedNotes.length === 0) {
      sidebarBody.innerHTML = `
        <div class="sidebar-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <p>Cliquez sur "Je note ça !" pour sauvegarder des conseils ici.</p>
        </div>
      `;

      if (copyBtn) copyBtn.style.display = 'none';
      return;
    }

    if (copyBtn) copyBtn.style.display = 'flex';

    sidebarBody.innerHTML = savedNotes.map(note => `
      <div class="note-item" data-note="${note.number}">
        <div class="note-item-number">Conseil #${note.number}</div>
        <div class="note-item-text"><strong>${note.title}</strong><br>${note.text}</div>
        <button class="note-item-remove" onclick="removeNoteFromSidebar(${note.number})" aria-label="Supprimer cette note" title="Supprimer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    `).join('');
  }

  // Expose removeNote globally for inline onclick
  window.removeNoteFromSidebar = function(tipNumber) {
    removeNote(tipNumber);
  };

  // ── Update Badge ─────────────────────────────────────────
  function updateBadge() {
    if (!badge) return;
    if (savedNotes.length > 0) {
      badge.textContent = savedNotes.length;
      badge.classList.add('visible');
    } else {
      badge.classList.remove('visible');
    }
  }

  // ── Copy to Clipboard ────────────────────────────────────
  if (copyBtn) {
    copyBtn.style.display = 'none';

    copyBtn.addEventListener('click', async () => {
      if (savedNotes.length === 0) return;

      const text = [
        '# Mes notes — Conférence UCM sur l\'Intelligence Artificielle',
        `# par Diederick Legrain — AI-Shift.be`,
        '',
        ...savedNotes.map(n =>
          `## Conseil #${n.number} — ${n.title}\n${n.text}`
        ),
        '',
        `--- Exporté le ${new Date().toLocaleDateString('fr-FR')} ---`
      ].join('\n\n');

      try {
        await navigator.clipboard.writeText(text);

        // Visual feedback
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Copié dans le presse-papiers !
        `;
        copyBtn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';

        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
          copyBtn.style.background = '';
        }, 2500);

      } catch (err) {
        console.warn('Clipboard error:', err);
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    });
  }

  // ── Initial render ───────────────────────────────────────
  renderNotes();
}
