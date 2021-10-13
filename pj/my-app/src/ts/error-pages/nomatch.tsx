import { useLocation } from 'react-router-dom'

export function NoMatch() {
  let location = useLocation();

  return (
    <div>
      <h3>
        No match for &apos;<code>{location.pathname}</code>&apos;
      </h3>
    </div>
  );
}