from app.models import Metamodel


def test_new_metamodel():
    metamodel = Metamodel.add_new_metamodel(metamodel_name='metamodel_name', metamodel_schema='metamodel_schema',
                                            target_connection_id=1)
    assert metamodel.metamodel_id != ''
    assert metamodel.metamodel_name == 'metamodel_name'
    assert metamodel.metamodel_schema == 'metamodel_schema'
    assert metamodel.target_connection_id == 1


def test_add_new_table():
    metamodel = Metamodel.add_new_metamodel(metamodel_name='metamodel_name', metamodel_schema='metamodel_schema',
                                            target_connection_id=1)
    metamodel.add_new_table('table1')
    assert metamodel.tables == 'table1'
    metamodel.add_new_table('table2')
    assert metamodel.tables == 'table1, table2'
