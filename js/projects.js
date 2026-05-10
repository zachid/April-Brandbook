// ─────────────────────────────────────────────────────────────────
//  Projects — shared localStorage data manager
//  Used by: dashboard, intake, brandbook
// ─────────────────────────────────────────────────────────────────

const Projects = {

  getAll() {
    try { return JSON.parse(localStorage.getItem('bb_projects') || '[]'); }
    catch { return []; }
  },

  get(id) {
    try { return JSON.parse(localStorage.getItem(`bb_project_${id}`) || 'null'); }
    catch { return null; }
  },

  save(config) {
    const id      = config.id || (Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
    const now     = new Date().toISOString();
    const project = { ...config, id, updated: now, created: config.created || now };

    // Update the index list (summary only)
    const list    = this.getAll().filter(p => p.id !== id);
    list.unshift({
      id,
      name:        project.name        || 'Untitled',
      tagline:     project.tagline     || '',
      accentColor: project.accentColor || '#8B5CF6',
      created:     project.created,
      updated:     now,
    });
    localStorage.setItem('bb_projects', JSON.stringify(list));

    // Save full config
    localStorage.setItem(`bb_project_${id}`, JSON.stringify(project));
    return project;
  },

  delete(id) {
    const list = this.getAll().filter(p => p.id !== id);
    localStorage.setItem('bb_projects', JSON.stringify(list));
    localStorage.removeItem(`bb_project_${id}`);
  },

  // Seed the demo AURA project if no projects exist
  seedDemo() {
    if (this.getAll().length > 0) return;
    if (typeof BRAND !== 'undefined') {
      this.save({ ...BRAND, id: 'demo' });
    }
  },
};
