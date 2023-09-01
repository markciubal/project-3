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
  const truthyChange = (value) => {
    if (value === true) {
      return "Detected";
    } else {
      return "Not Detected";
    }
  }
  useEffect(() => {
    let toxicTableHTML = (
      <div className="toxic-table">
        <table style={{fontSize: "8pt"}}>
          <tbody>
            <th>
              <td key={"type"}>Type</td>
              <td key={"value"}>Value</td>
            </th>
            {props.toxicityResult.map(toxic => (
              <tr>
                <td key={toxic.label + "-label"}><span>{labelChange(toxic.label)}</span></td>
                <td key={toxic.label+ "-value"}><span>{truthyChange(toxic.results[0].match)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    setToxicTable(toxicTableHTML);
  }, [props.toxicityResult]);

  return <div>{toxicTable}</div>;
}

export default ToxicityGrid;