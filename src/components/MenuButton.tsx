export function MenuButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button {...props} className={"h-full text-white px-2 " + props.className}>
            {props.children}
        </button>
    );
}