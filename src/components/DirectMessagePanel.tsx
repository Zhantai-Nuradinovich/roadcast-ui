export function DirectMessagePanel({ selectedUserId, onSend }) {
  const [message, setMessage] = useState("");

  return (
    <div>
      <textarea onChange={(e) => setMessage(e.target.value)} />
      <button onClick={() => onSend(selectedUserId, message)}>Send</button>
    </div>
  );
}
