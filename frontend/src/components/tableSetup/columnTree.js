import React, { Component } from "react";
import TreeView from "react-treeview";
import "react-treeview/react-treeview.css";
import Column from "./column";

class ColumnTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
    };
  }

  componentDidMount() {
    const treeData = this.groupColumnsByTable(this.props.data);
    this.setState({ treeData: treeData });
  }

  groupColumnsByTable(data) {
    const groups = {};
    data.forEach((column) => {
      const tableName = column.table_name;
      if (!groups[tableName]) {
        groups[tableName] = [];
      }
      groups[tableName].push(column);
    });

    const treeData = [];
    Object.keys(groups).forEach((tableName) => {
      const columns = groups[tableName].map((column) => (
        <Column column={column} key={column.key} />
      ));
      treeData.push(
        <TreeView key={tableName} nodeLabel={tableName}>
          {columns}
        </TreeView>
      );
    });

    return treeData;
  }

  render() {
    return (
      <div>
        <TreeView nodeLabel="Táblák">{this.state.treeData}</TreeView>
      </div>
    );
  }
}

export default ColumnTree;
