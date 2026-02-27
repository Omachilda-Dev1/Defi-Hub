export default function NetworkBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-50">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgb(251, 184, 19)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {/* Network nodes */}
        <circle cx="10%" cy="20%" r="3" fill="#FDB813" opacity="0.6"/>
        <circle cx="30%" cy="15%" r="2" fill="#FDB813" opacity="0.4"/>
        <circle cx="50%" cy="25%" r="4" fill="#FDB813" opacity="0.7"/>
        <circle cx="70%" cy="18%" r="2.5" fill="#FDB813" opacity="0.5"/>
        <circle cx="90%" cy="22%" r="3" fill="#FDB813" opacity="0.6"/>
        <circle cx="15%" cy="40%" r="2" fill="#FDB813" opacity="0.4"/>
        <circle cx="40%" cy="45%" r="3.5" fill="#FDB813" opacity="0.6"/>
        <circle cx="65%" cy="42%" r="2" fill="#FDB813" opacity="0.5"/>
        <circle cx="85%" cy="48%" r="3" fill="#FDB813" opacity="0.6"/>
        <circle cx="20%" cy="65%" r="2.5" fill="#FDB813" opacity="0.5"/>
        <circle cx="50%" cy="70%" r="3" fill="#FDB813" opacity="0.6"/>
        <circle cx="80%" cy="68%" r="2" fill="#FDB813" opacity="0.4"/>
        <circle cx="35%" cy="85%" r="3.5" fill="#FDB813" opacity="0.6"/>
        <circle cx="70%" cy="88%" r="2.5" fill="#FDB813" opacity="0.5"/>
        {/* Connection lines */}
        <line x1="10%" y1="20%" x2="30%" y2="15%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
        <line x1="30%" y1="15%" x2="50%" y2="25%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
        <line x1="50%" y1="25%" x2="70%" y2="18%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
        <line x1="70%" y1="18%" x2="90%" y2="22%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
        <line x1="15%" y1="40%" x2="40%" y2="45%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
        <line x1="40%" y1="45%" x2="65%" y2="42%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
        <line x1="65%" y1="42%" x2="85%" y2="48%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
        <line x1="50%" y1="25%" x2="40%" y2="45%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
        <line x1="20%" y1="65%" x2="50%" y2="70%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
        <line x1="50%" y1="70%" x2="80%" y2="68%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
        <line x1="35%" y1="85%" x2="70%" y2="88%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
        <line x1="40%" y1="45%" x2="50%" y2="70%" stroke="#FDB813" strokeWidth="0.5" opacity="0.3"/>
      </svg>
    </div>
  )
}
