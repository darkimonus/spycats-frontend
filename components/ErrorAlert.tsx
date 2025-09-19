export default function ErrorAlert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      style={{
        border: '1px solid #f5c2c7',
        background: '#f8d7da',
        color: '#842029',
        padding: '10px 12px',
        borderRadius: 6,
        margin: '8px 0 16px',
      }}
    >
      {message}
    </div>
  );
}

