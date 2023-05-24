from sqlalchemy import quoted_name
from app.models import db


class Table(db.Model):
    __tablename__ = 'tables'
    __table_args__ = {'schema': 'bifrost'}

    sequence = db.Sequence('seq_table', schema='bifrost')

    table_id = db.Column(db.Integer, sequence, primary_key=True, index=True)
    table_name = db.Column(db.String(50), nullable=False)
    columns = db.Column(db.String(1000))
    table_type = db.Column(db.String(50), nullable=False)
    dimension_type = db.Column(db.String(50))
    dimension_key = db.Column(db.String(50))
    metamodel_id = db.Column(db.Integer, nullable=False)
    source_connection_id = db.Column(db.Integer)
    sql = db.Column(db.String(3000))

    def to_dict(self):
        return {
            'table_id': self.table_id,
            'table_name': self.table_name,
            'columns': self.columns,
            'table_type': self.table_type,
            'dimension_type': self.dimension_type,
            'dimension_key': self.dimension_key,
            'source_connection_id': self.source_connection_id,
            'metamodel_id': self.metamodel_id,
            'sql': self.sql
        }

    @staticmethod
    def add_new_table(table_name, columns, table_type, dimension_type, dimension_key, source_connection_id,
                      metamodel_id, sql):
        new_table = Table(table_name=table_name, columns=columns, table_type=table_type, dimension_type=dimension_type,
                          dimension_key=dimension_key, source_connection_id=source_connection_id,
                          metamodel_id=metamodel_id, sql=sql)
        return new_table

    def add_new_column(self, column_name):
        if self.columns == '':
            self.columns = column_name
        else:
            self.columns = self.columns + ', ' + column_name
        return self

    def modify_sql(self, sql):
        self.sql = sql
        return self

    @staticmethod
    def get_all_tables():
        tables = Table.query.all()
        return tables

    @staticmethod
    def get_by_id(table_id):
        table = Table.query.filter_by(table_id=table_id)[0]
        return table

    @staticmethod
    def get_by_name(table_name):
        table = Table.query.filter_by(table_name=table_name)[0]
        return table

    @staticmethod
    def check_delete_metamodel(metamodel_id):
        tables = Table.query.filter_by(metamodel_id=metamodel_id)[0]
        if tables:
            return True
        else:
            return False
