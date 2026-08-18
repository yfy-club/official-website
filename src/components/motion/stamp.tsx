export function Stamp({ message = "报名已提交" }: { message?: string }) {
  return (
    <p className="stamp" role="status" aria-live="polite">
      <span aria-hidden="true">已收到</span>
      <span className="sr-only">{message}</span>
    </p>
  );
}
