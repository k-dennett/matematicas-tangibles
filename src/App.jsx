import { useMemo, useState } from 'react'
import a1 from './activities/definitions/fraccion-parte-de-un-todo-01.js'
import ActivityRunner from './activities/engine/ActivityRunner.jsx'
import { useSettingsStore } from './state/settingsStore.js'
import { useReducedMotion } from './hooks/useReducedMotion.js'

const ACTIVITIES = [
  {
    id: a1.id,
    title: a1.titulo,
    phase: 'Fase 1',
    status: 'Disponible',
    description: 'Parte una barra en partes iguales y toma algunas para formar la fraccion.',
    definition: a1,
  },
  {
    id: 'placeholder-recta',
    title: 'Recta numérica 3D',
    phase: 'Fase 2',
    status: 'Próximamente',
    description: 'Ubicar fracciones como posiciones en el espacio.',
  },
  {
    id: 'placeholder-suma',
    title: 'Sumar y restar fracciones',
    phase: 'Fase 3',
    status: 'Próximamente',
    description: 'Unir y quitar partes con igual denominador.',
  },
]

function HomeScreen({ activities, onLaunch }) {
  return (
    <section className="home">
      <div className="home__hero">
        <p className="home__eyebrow">Fase 0</p>
        <h1 className="home__title">Matematicas Tangibles</h1>
        <p className="home__lead">
          Aprende fracciones manipulando objetos 3D, viendo el dibujo y leyendo el simbolo al mismo tiempo.
        </p>
      </div>

      <div className="home__grid">
        {activities.map((activity) => (
          <article className="activity-card" key={activity.id}>
            <div className="activity-card__meta">
              <span className="pill">{activity.phase}</span>
              <span className={`pill pill--${activity.status === 'Disponible' ? 'ready' : 'muted'}`}>{activity.status}</span>
            </div>
            <h2 className="activity-card__title">{activity.title}</h2>
            <p className="activity-card__text">{activity.description}</p>
            {activity.definition ? (
              <button className="btn btn--primary" onClick={() => onLaunch(activity.definition)}>
                Abrir actividad
              </button>
            ) : (
              <button className="btn btn--primary" disabled>
                En desarrollo
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

function ShellHeader({ screen, onHome, onActivity, audio, modo, onToggleAudio, onToggleModo, reducedMotion }) {
  return (
    <header className="shell-header">
      <div className="shell-header__brand">
        <p className="shell-header__kicker">Centro de Innovacion</p>
        <strong>Matematicas Tangibles</strong>
      </div>

      <nav className="shell-header__nav" aria-label="Navegacion principal">
        <button className={`btn ${screen === 'home' ? 'btn--primary' : ''}`} onClick={onHome}>
          Inicio
        </button>
        <button className={`btn ${screen === 'activity' ? 'btn--primary' : ''}`} onClick={onActivity}>
          Actividad
        </button>
      </nav>

      <div className="shell-header__controls" aria-label="Ajustes rapidos">
        <button className="btn" onClick={onToggleAudio}>
          Audio {audio ? 'ON' : 'OFF'}
        </button>
        <button className="btn" onClick={onToggleModo}>
          {modo === 'individual' ? 'Modo individual' : 'Modo proyeccion'}
        </button>
        <span className="shell-header__state">{reducedMotion ? 'Menos movimiento' : 'Movimiento normal'}</span>
      </div>
    </header>
  )
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [selectedActivityId, setSelectedActivityId] = useState(a1.id)
  const audio = useSettingsStore((s) => s.audio)
  const modo = useSettingsStore((s) => s.modo)
  const toggleAudio = useSettingsStore((s) => s.toggleAudio)
  const setModo = useSettingsStore((s) => s.setModo)
  const reducedMotion = useReducedMotion()

  const selectedActivity = useMemo(
    () => ACTIVITIES.find((activity) => activity.id === selectedActivityId)?.definition ?? a1,
    [selectedActivityId],
  )

  const openActivity = (definition) => {
    setSelectedActivityId(definition.id)
    setScreen('activity')
  }

  return (
    <div className="app-shell">
      <ShellHeader
        screen={screen}
        onHome={() => setScreen('home')}
        onActivity={() => setScreen('activity')}
        audio={audio}
        modo={modo}
        onToggleAudio={toggleAudio}
        onToggleModo={() => setModo(modo === 'individual' ? 'proyeccion' : 'individual')}
        reducedMotion={reducedMotion}
      />

      <main className="shell-main">
        {screen === 'home' ? <HomeScreen activities={ACTIVITIES} onLaunch={openActivity} /> : <ActivityRunner definicion={selectedActivity} />}
      </main>
    </div>
  )
}
