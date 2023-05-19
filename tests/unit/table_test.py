from app.models import Table


def test_new_table():
    table = Table.add_new_table(table_name='table_name', columns='column1, column2', table_type='view',
                                dimension_type='', dimension_key='', source_connection_id=1, metamodel_id=1,
                                sql='SELECT *')
    assert table.table_id != ''
    assert table.table_name == 'table_name'
    assert table.columns == 'column1, column2'
    assert table.table_type == 'view'
    assert table.dimension_type == ''
    assert table.dimension_key == ''
    assert table.source_connection_id == 1
    assert table.metamodel_id == 1
    assert table.sql == 'SELECT *'


def test_add_new_column():
    table = Table.add_new_table(table_name='table_name', columns='', table_type='view', dimension_type='',
                                dimension_key='', source_connection_id=1, metamodel_id=1, sql='SELECT *')
    table.add_new_column('column1')
    assert table.columns == 'column1'
    table.add_new_column('column2')
    assert table.columns == 'column1, column2'


def test_modify_sql():
    table = Table.add_new_table(table_name='table_name', columns='', table_type='view', dimension_type='',
                                dimension_key='', source_connection_id=1, metamodel_id=1, sql='SELECT *')
    table.modify_sql('SELECT * FROM TABLE')
    assert table.sql == 'SELECT * FROM TABLE'
