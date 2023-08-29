import { useState, useEffect } from 'react';
    // console.log(toxic.label, toxic.results[0].match)
const labelChange = (label) => {
  let newLabel = '';
  switch(label) {
    case '':
      // code block
      break;
    case 'identity_attack':
      newLabel = "Identity Attack";
      break;
    case 'insult':
      newLabel = "Insult";
      break;
    case "obscene":
      newLabel = "Obscene"
      break;
    case 'severe_toxicity':
      newLabel = "Severe Toxicity"
      break;
    case 'sexual_explicit':
      newLabel = "Sexually Explicit"
      break;
    case 'threat':
      newLabel = "Threat"
      break;
    case 'toxicity':
      newLabel = "Toxic"
      break;
    default:
      newLabel = label
  }
  return newLabel;
}
const ToxicityGrid = (props) => {
  const [toxicTable, setToxicTable] = useState(null);

  useEffect(() => {
    let toxicTableHTML = (
      <div className="toxic-table">
        <table style={{fontSize: "8pt"}}>
          <thead>
            <tr>
              {props.toxicityResult.map(toxic => (
                <th key={toxic.label}><span>{labelChange(toxic.label)}</span></th>
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
      </div>
    );

    setToxicTable(toxicTableHTML);
  }, [props.toxicityResult]);

  return <div>{toxicTable}</div>;
}

export default ToxicityGrid;