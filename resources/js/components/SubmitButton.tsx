type Props = {
    loading: boolean;
    children: React.ReactNode;
};

export default function SubmitButton({ loading, children }: Props) {
    return (
        <button
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
        >
            {loading ? "Processing..." : children}
        </button>
    );
}