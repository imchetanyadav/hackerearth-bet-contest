import * as React from "react";
// Using react-table first time and due to time constraints haven't researched much and might not be using it in best way
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";
import { Candidate } from "../App";

interface Props {
  data: Array<Candidate>;
  onCandidateSelection: (isSelected: boolean, name: string) => void;
}

function GlobalFilter({
  globalFilter,
  setGlobalFilter,
}: {
  globalFilter: any;
  setGlobalFilter: any;
}) {
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div className="mb-5">
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        className="p-2 border-b-2 w-full"
        placeholder="Search"
      />
    </div>
  );
}

const CandidateTable: React.FC<Props> = ({ data, onCandidateSelection }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Selected",
        accessor: "isSelected",
      },
      {
        Header: "Player Name",
        accessor: "name",
      },
      {
        Header: "Avatar",
        accessor: "avatar",
      },
      {
        Header: "🎯 Bet",
        accessor: "bet",
      },
      {
        Header: "🏆 Wins",
        accessor: "wins",
      },
      {
        Header: "Lost",
        accessor: "lost",
      },
      {
        Header: "💰 Price",
        accessor: "price",
      },
      {
        Header: "Winnings",
        accessor: "winnings",
      },
      {
        Header: "Fate",
        accessor: "fate",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    state,
    setGlobalFilter,
  } = useTable(
    {
      //@ts-ignore
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy
  );

  return (
    <div className="p-8">
      <GlobalFilter
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <table {...getTableProps()} className="w-full">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={`${
                    column.id === "name" ? "text-left" : "text-center"
                  } cursor-pointer`}
                  style={{ width: column.id === "isSelected" ? 90 : "auto" }}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row: any, i: any) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="h-16">
                {row.cells.map((cell: any) => {
                  if (cell.column.id === "isSelected")
                    return (
                      <td {...cell.getCellProps()}>
                        <input
                          type="checkbox"
                          checked={cell.value}
                          onChange={(e) =>
                            onCandidateSelection(
                              e.target.checked,
                              cell.row.original.name
                            )
                          }
                        />
                      </td>
                    );
                  else if (cell.column.id === "avatar")
                    return (
                      <td {...cell.getCellProps()}>
                        <div>
                          <img
                            src={cell.value}
                            alt={cell.row.original.name}
                            className="rounded-sm mx-auto"
                            style={{ width: 40, height: 40 }}
                          />
                        </div>
                      </td>
                    );
                  else if (cell.column.id === "name")
                    return (
                      <td {...cell.getCellProps()} className="text-left">
                        {cell.render("Cell")}
                      </td>
                    );
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateTable;
