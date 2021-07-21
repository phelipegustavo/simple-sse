import React from 'react';
import { useGetFactsQuery } from './api/facts';
import './App.css';

function Facts() {
  const { data: facts, isLoading, error } = useGetFactsQuery()

  return isLoading ? (
    'Carregando...'
  ) :error ? (
    JSON.stringify(error)
  ) : facts ? (
    <table className="stats-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Fact</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        {
          facts.map((fact, i) =>
            <tr key={i}>
              <td>{i}</td>
              <td>{fact.info}</td>
              <td>{fact.source}</td>
            </tr>
          )
        }
      </tbody>
    </table>
  ) : 'Nada a exibir';
}

export default Facts;