import AnswerForm from "./AnswerForm"

export default function QuestionForm({ index, data, onChange }: any) {
    const updateAnswer = (i: number, answer: any) => {
        const newAnswers = [...data.answers]
        newAnswers[i] = answer
        onChange({ ...data, answers: newAnswers })
    }

    const addAnswer = () => {
        onChange({
            ...data,
            answers: [...data.answers, { answer_text: "", is_correct: false }],
        })
    }

    return (
        <div className="border p-4 rounded-xl mb-4">
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return

                    onChange({
                        ...data,
                        media_file: file, // 🔥 file asli
                        media_url: URL.createObjectURL(file) // 🔥 preview
                    })
                }}
            />
            <input
                type="text"
                placeholder="Question..."
                value={data.question_text}
                onChange={(e) =>
                    onChange({ ...data, question_text: e.target.value })
                }
                className="w-full mb-3"
            />

            {data.answers.map((a: any, i: number) => (
                <AnswerForm
                    key={i}
                    data={a}
                    onChange={(ans: any) => updateAnswer(i, ans)}
                />
            ))}

            <button onClick={addAnswer}>+ Add Answer</button>
        </div>
    )
}