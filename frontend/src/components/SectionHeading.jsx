import './SectionHeading.css';

export default function SectionHeading({ title }) {
    return (
        <div className="section-heading">
            <span className="section-heading__accent" aria-hidden="true" />
            <h2 className="section-heading__title">{title}</h2>
        </div>
    );
}
