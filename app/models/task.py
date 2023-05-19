from app.models import db


class Task(db.Model):
    __tablename__ = 'tasks'
    __table_args__ = {'schema': 'bifrost'}

    task_id = db.Column(db.Integer, db.Sequence('seq_task'), primary_key=True, index=True)
    table_id = db.Column(db.Integer)
    load_type = db.Column(db.String(64))
    task_trigger = db.Column(db.String(64))
    task_schedule = db.Column(db.String(64))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    last_run = db.Column(db.Date)
    status = db.Column(db.String(64))

    def to_dict(self):
        return {
            'task_id': self.task_id,
            'table_id': self.table_id,
            "load_type": self.load_type,
            'task_trigger': self.task_trigger,
            'task_schedule': self.task_schedule,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'last_run': self.last_run,
            'status': self.status,
        }

    @staticmethod
    def add_new_task(table_id, load_type, task_trigger, task_schedule, start_date, end_date):
        new_task = Task(table_id=table_id, load_type=load_type, task_trigger=task_trigger,
                        task_schedule=task_schedule, status='New', start_date=start_date, end_date=end_date)
        db.session.add(new_task)
        db.session.commit()
        return new_task

    @staticmethod
    def get_by_id(task_id):
        task = Task.query.filter_by(task_id=task_id)[0]
        return task

    def modify_status(self, status):
        self.status = status
        db.session.commit()
        return self

    def modify_schedule(self, task_schedule):
        self.task_schedule = task_schedule
        db.session.commit()
        return self

    def modify_start_date(self, start_date):
        self.start_date = start_date
        db.session.commit()
        return self

    def modify_end_date(self, end_date):
        self.end_date = end_date
        db.session.commit()
        return self

    def modify_last_run(self, last_run):
        self.last_run = last_run
        db.session.commit()
        return self

    def unschedule(self):
        self.status = 'Unscheduled'
        db.session.commit()
        return self

