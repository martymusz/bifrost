from app.models import db


class Column(db.Model):
    __tablename__ = 'columns'
    __table_args__ = {'schema': 'bifrost'}

    sequence = db.Sequence('seq_column', schema='bifrost')

    column_id = db.Column(db.Integer, sequence, primary_key=True, index=True)
    column_name = db.Column(db.String(80))
    column_type = db.Column(db.String(80))
    table_id = db.Column(db.Integer)

    def to_dict(self):
        return {
            'column_id': self.column_id,
            'column_name': self.column_name,
            'column_type': self.column_type,
            'table_id': self.table_id,
        }

    @staticmethod
    def add_new_column(column_name, column_type, table_id):
        new_column = Column(column_name=column_name, column_type=column_type, table_id=table_id)
        return new_column

    @staticmethod
    def get_all_columns():
        columns = Column.query.all()
        return columns

    @staticmethod
    def get_by_id(column_id):
        column = Column.query.filter_by(column_id=column_id)[0]
        return column

    @staticmethod
    def get_by_name(column_name):
        column = Column.query.filter_by(column_name=column_name)[0]
        return column
