from app.models import Column


def test_new_column():
    column = Column.add_new_column(column_name='column_name', column_type='column_type')
    assert column.table_id != ''
    assert column.column_name == 'column_name'
    assert column.column_type == 'column_type'
