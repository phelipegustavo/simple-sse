import React from 'react';
import { Link } from 'react-router-dom';
import { useGetFactsQuery } from './api/facts';
import './App.css';

function Facts() {
  const { data: facts, isLoading, error } = useGetFactsQuery()

  return isLoading ? (
    'Carregando...'
  ) :error ? (
    JSON.stringify(error)
  ) : facts ? (
    <>
      <Link to="/">
        <button>Home</button>
      </Link>
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
            Object.values(facts.entities).map((fact, i) =>
              <tr key={i}>
                <td>{fact.id}</td>
                <td>{fact.info}</td>
                <td>{fact.source}</td>
              </tr>
            )
          }
        </tbody>
      </table>
    </>
  ) : 'Nada a exibir';
}

export default Facts;