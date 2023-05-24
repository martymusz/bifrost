
# join type => 1: inner join, 2: left join, 3: right join
def sqlmapper(source_table, columns, joins, filters):
    column_list = ''
    if len(columns) == 0:
        column_list = '*'
    else:
        for column in columns:
            if len(column_list) == 0:
                column_list = column["key"].replace('_', '.')
            else:
                column_list = column_list + ', ' + column["key"].replace('_', '.')

    select_clause = f"SELECT {column_list}"
    from_clause = f"FROM {source_table}"

    join_clauses = []
    join_type = ''
    for join in joins:
        if join["join_type"] == 1:
            join_type += 'INNER JOIN'
        elif join["join_type"] == 2:
            join_type += 'LEFT JOIN'
        elif join["join_type"] == 3:
            join_type += 'RIGHT JOIN'
        condition = join["join_condition"].replace('_', '.')
        join_clause = f"{join_type} {join['table_name']} ON {condition}"
        join_clauses.append(join_clause)

    where_clause = ''
    for fltr in filters:
        if len(where_clause) == 0:
            new_clause = 'WHERE ' + fltr["condition"]
            where_clause = new_clause

        else:
            new_clause = ' AND ' + fltr["condition"]
            where_clause = where_clause + new_clause

    sql = f"{select_clause} {from_clause} {' '.join(join_clauses)} {where_clause}"
    return sql


