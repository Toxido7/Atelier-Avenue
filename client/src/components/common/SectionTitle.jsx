import Badge from './Badge'

function SectionTitle({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <Badge>{eyebrow}</Badge>}
      <h2 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.04em] text-ink md:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-base leading-7 text-stone">{description}</p>}
    </div>
  )
}

export default SectionTitle
