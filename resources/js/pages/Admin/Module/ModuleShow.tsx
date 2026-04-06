export default function ModuleShow({ module }: any) {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold">{module.title}</h1>

            {module.contents.map((item: any) => {
                if (item.type === "image") {
                    return <img src={item.content.url} className="w-full" />;
                }

                if (item.type === "video") {
                    return (
                        <video controls className="w-full">
                            <source src={item.content.url} />
                        </video>
                    );
                }

                return (
                    <a href={item.content.url} target="_blank">
                        📄 {item.content.name}
                    </a>
                );
            })}
        </div>
    );
}