export function FeatureCard(props: {title: string, description: string, src: string, swap: boolean}) {
    const {title, description, src, swap} = props;
    const text = (
        <div className="flex flex-col gap-1 px-16">
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
    const img = <img src={src}/>;
    return (
        <section className="flex flex-col grid-cols-2 lg:grid m-4 lg:m-16 max-w-[72em] gap-4">
            {swap ? <>{img}{text}</> : <>{text}{img}</>}
        </section>
    );
}