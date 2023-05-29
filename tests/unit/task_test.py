from datetime import datetime
from app.models import Task


def test_new_task():
    task = Task.add_new_task(table_id=1, owner_id=1, load_type='load_type', task_trigger='task_trigger',
                             task_schedule='task_schedule', table_name='table_name', owner_name='owner_name',
                             start_date=datetime.strptime('9999-12-30 00:00', '%Y-%m-%d %H:%M'),
                             end_date=datetime.strptime('9999-12-31 00:00', '%Y-%m-%d %H:%M'))
    assert task.task_id != ''
    assert task.table_id == 1
    assert task.load_type == 'load_type'
    assert task.task_trigger == 'task_trigger'
    assert task.task_schedule == 'task_schedule'
    assert task.status == 'Új'
    assert task.start_date == datetime.strptime('9999-12-30 00:00', '%Y-%m-%d %H:%M')
    assert task.end_date == datetime.strptime('9999-12-31 00:00', '%Y-%m-%d %H:%M')


def test_modify_status():
    task = Task.add_new_task(table_id=1, owner_id=1, load_type='load_type', task_trigger='task_trigger',
                             task_schedule='task_schedule',table_name='table_name', owner_name='owner_name',
                             start_date=datetime.strptime('9999-12-30 00:00', '%Y-%m-%d %H:%M'),
                             end_date=datetime.strptime('9999-12-31 00:00', '%Y-%m-%d %H:%M'))
    task.modify_status('Successful')
    assert task.status == 'Successful'


def test_modify_last_run():
    task = Task.add_new_task(table_id=1, owner_id=1, load_type='load_type', task_trigger='task_trigger',
                             task_schedule='task_schedule',table_name='table_name', owner_name='owner_name',
                             start_date=datetime.strptime('9999-12-30 00:00', '%Y-%m-%d %H:%M'),
                             end_date=datetime.strptime('9999-12-31 00:00', '%Y-%m-%d %H:%M'))
    task.modify_last_run(datetime.strptime('9999-12-31 23:59', '%Y-%m-%d %H:%M'))
    assert task.last_run == datetime.strptime('9999-12-31 23:59', '%Y-%m-%d %H:%M')


def test_modify_start_date():
    task = Task.add_new_task(table_id=1, owner_id=1, load_type='load_type', task_trigger='task_trigger',
                             task_schedule='task_schedule',table_name='table_name', owner_name='owner_name',
                             start_date=datetime.strptime('9999-12-30 00:00', '%Y-%m-%d %H:%M'),
                             end_date=datetime.strptime('9999-12-31 00:00', '%Y-%m-%d %H:%M'))
    task.modify_start_date(datetime.strptime('9999-12-31 23:59', '%Y-%m-%d %H:%M'))
    assert task.start_date == datetime.strptime('9999-12-31 23:59', '%Y-%m-%d %H:%M')


def test_modify_end_date():
    task = Task.add_new_task(table_id=1, owner_id=1, load_type='load_type', task_trigger='task_trigger',
                             task_schedule='task_schedule',table_name='table_name', owner_name='owner_name',
                             start_date=datetime.strptime('9999-12-30 00:00', '%Y-%m-%d %H:%M'),
                             end_date=datetime.strptime('9999-12-31 00:00', '%Y-%m-%d %H:%M'))
    task.modify_end_date(datetime.strptime('9999-12-31 23:59', '%Y-%m-%d %H:%M'))
    assert task.end_date == datetime.strptime('9999-12-31 23:59', '%Y-%m-%d %H:%M')
