import { useState, useEffect } from 'react';
    // console.log(toxic.label, toxic.results[0].match)

const ToxicityGrid = (props) => {
  const [toxicTable, setToxicTable] = useState(null);

  useEffect(() => {
    let toxicTableHTML = (
      <table>
        <thead>
          <tr>
            {props.toxicityResult.map(toxic => (
              <th key={toxic.label}>{toxic.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {props.toxicityResult.map(toxic => (
              <td className={`${String(toxic.results[0].match)}`} key={toxic.label}>{String(toxic.results[0].match)}</td>
            ))}
          </tr>
        </tbody>
      </table>
    );

    setToxicTable(toxicTableHTML);
  }, [props.toxicityResult]);

  return <div>{toxicTable}</div>;
}

export default ToxicityGrid;