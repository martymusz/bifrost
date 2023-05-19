from app.models import db


def table_mapper(table_name, source_columns, schema, table_type):
    columns = []
    metadata = db.MetaData(schema=schema)
    for column in source_columns:
        column_name = column["column_name"]
        column_type = getattr(db, column["column_type"])
        new_column = db.Column(column_name, column_type)
        columns.append(new_column)

    # Technikai mezők hozzáadása attól függően hogy dimenzió vagy ténytábla - ezeket nem kell felvezetni az adatmodellbe
    if table_type == 'dim':
        start_date = db.Column(name='start_date', type_=db.DateTime)
        end_date = db.Column(name='end_date', type_=db.DateTime)
        current_flg = db.Column(name='current_flg', type_=db.String(5))
        checksum = db.Column(name='checksum', type_=db.String(200))

        columns.append(start_date)
        columns.append(end_date)
        columns.append(current_flg)
        columns.append(checksum)

    else:
        creation_date = db.Column(name='creation_date', type_=db.DateTime)
        columns.append(creation_date)

    return db.Table(table_name, metadata, *columns)
