type Props = {
    loading: boolean;
    children: React.ReactNode;
};

export default function SubmitButton({ loading, children }: Props) {
    return (
        <button
            disabled={loading}
            className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
        >
            {loading ? 'Processing...' : children}
        </button>
    );
}
