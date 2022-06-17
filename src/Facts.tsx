import React from 'react';
import { Link } from 'react-router-dom';
import { useGetFactsQuery } from './api/facts';
import './App.css';

function Facts() {
  const { data: facts, isFetching, error } = useGetFactsQuery()

  return (
    <>
      <Link to="/">
        <button>Home</button>
      </Link>
      {isFetching ? (
        'Carregando...'
      ) : error ? (
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
                Object.values(facts.entities).map(fact => (
                  <tr key={fact?.id}>
                    <td>{fact?.id}</td>
                    <td>{fact?.info}</td>
                    <td><a href={fact?.source} target="_blank" rel="noreferrer">Ver</a></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
      ) : 'Nada a exibir'}
    </>
  )
}

export default Facts;