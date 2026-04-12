export default function AnswerForm({ data, onChange }: any) {
    return (
        <div className="flex items-center gap-2 mb-2">
            <input
                type="text"
                placeholder="Answer..."
                value={data.answer_text}
                onChange={(e) =>
                    onChange({ ...data, answer_text: e.target.value })
                }
                className="flex-1"
            />

            <input
                type="checkbox"
                checked={data.is_correct}
                onChange={(e) =>
                    onChange({ ...data, is_correct: e.target.checked })
                }
            />

            <span>Correct</span>
        </div>
    )
}