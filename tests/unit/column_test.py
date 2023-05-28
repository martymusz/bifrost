from app.models import Column


def test_new_column():
    column = Column.add_new_column(column_name='column_name', column_type='column_type', table_id=1)
    assert column.column_id != ''
    assert column.column_name == 'column_name'
    assert column.column_type == 'column_type'
