const DEFAULT_QUESTIONS = [
  "What are the termination conditions?",
  "Which clauses create financial risk?",
  "Summarise the liability obligations.",
  "What deadlines should I track?",
];

function SuggestedQuestions({ onSelect, questions = DEFAULT_QUESTIONS }) {
  return (
    <div className="suggested-questions">
      <span className="suggested-questions__label">Suggested questions</span>
      <div>
        {questions.map((question) => (
          <button key={question} type="button" onClick={() => onSelect(question)}>
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SuggestedQuestions;
