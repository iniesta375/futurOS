import { useState, useMemo, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PackageOpen } from 'lucide-react'
import { PROJECTS, CATEGORIES } from './projectsData'
import PJHeader      from './PJHeader'
import PJFilters     from './PJFilters'
import PJCard        from './PJCard'
import PJListRow     from './PJListRow'
import PJDetailPanel from './PJDetailPanel'

export default function Projects() {
  const [searchQuery,     setSearchQuery]     = useState('')
  const [selectedCat,     setSelectedCat]     = useState('all')
  const [selectedTags,    setSelectedTags]    = useState([])
  const [showTags,        setShowTags]        = useState(false)
  const [featuredOnly,    setFeaturedOnly]    = useState(false)
  const [viewMode,        setViewMode]        = useState('grid')
  const [selectedProject, setSelectedProject] = useState(null)

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(p => {
      if (featuredOnly && !p.featured) return false
      if (selectedCat !== 'all' && p.category !== selectedCat) return false
      if (selectedTags.length > 0 && !selectedTags.every(t => p.tech.includes(t))) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tech.some(t => t.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [searchQuery, selectedCat, selectedTags, featuredOnly])

  const projectCounts = useMemo(() => {
    const counts = {}
    CATEGORIES.forEach(cat => {
      counts[cat.id] = cat.id === 'all'
        ? PROJECTS.length
        : PROJECTS.filter(p => p.category === cat.id).length
    })
    return counts
  }, [])

  const handleTagToggle   = useCallback((tag) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]), [])
  const handleProjectClick = useCallback((project) => setSelectedProject(prev => prev?.id === project.id ? null : project), [])

  const LIST_HEADERS = ['Project', 'Category', 'Status', 'Tech', 'Stars', '']

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100%', height: '100%',
      background: 'rgba(10,10,20,0.97)',
      overflow: 'hidden', fontFamily: 'var(--font-ui)',
    }}>
      <PJHeader
        searchQuery={searchQuery}    onSearchChange={setSearchQuery}
        resultCount={filteredProjects.length}  totalCount={PROJECTS.length}
        viewMode={viewMode}          onViewModeChange={setViewMode}
        featuredOnly={featuredOnly}  onFeaturedToggle={() => setFeaturedOnly(f => !f)}
      />
      <PJFilters
        selectedCategory={selectedCat}   onCategoryChange={setSelectedCat}
        selectedTags={selectedTags}       onTagToggle={handleTagToggle}
        onClearTags={() => setSelectedTags([])}
        projectCounts={projectCounts}
        showTags={showTags}               onToggleTags={() => setShowTags(s => !s)}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {/* Main content area */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <AnimatePresence mode="popLayout">
            {filteredProjects.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', padding: 64, gap: 14,
                  color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-ui)', fontSize: 13,
                }}
              >
                <PackageOpen size={44} strokeWidth={1.25} color="rgba(255,255,255,0.12)" />
                <div>No projects match your filters</div>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCat('all'); setSelectedTags([]) }}
                  style={{
                    padding: '7px 18px', borderRadius: 10, cursor: 'pointer',
                    background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                    color: '#818cf8', fontFamily: 'var(--font-ui)', fontSize: 12,
                  }}
                >
                  Clear all filters
                </button>
              </motion.div>
            ) : viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: selectedProject
                    ? 'repeat(auto-fill, minmax(220px, 1fr))'
                    : 'repeat(auto-fill, minmax(270px, 1fr))',
                  gap: 16, padding: 18, alignContent: 'start',
                  transition: 'grid-template-columns 0.25s',
                }}
              >
                <AnimatePresence>
                  {filteredProjects.map(p => (
                    <PJCard
                      key={p.id}
                      project={p}
                      onClick={handleProjectClick}
                      isSelected={selectedProject?.id === p.id}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                {/* List header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 90px 70px auto 80px 56px',
                  gap: 12, padding: '8px 18px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(8,8,18,0.5)',
                }}>
                  {LIST_HEADERS.map((label, i) => (
                    <div key={i} style={{
                      fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600,
                      color: 'rgba(255,255,255,0.28)', letterSpacing: '0.08em',
                    }}>
                      {label}
                    </div>
                  ))}
                </div>
                <AnimatePresence>
                  {filteredProjects.map((p, i) => (
                    <PJListRow
                      key={p.id}
                      project={p}
                      index={i}
                      onClick={handleProjectClick}
                      isSelected={selectedProject?.id === p.id}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedProject && (
            <PJDetailPanel
              key={selectedProject.id}
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
