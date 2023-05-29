import pandas as pd


# dátumformátum -> 'YYYY-MM-DD'
# load_option -> append/replace
def load_time_dimension(target_engine, target_table, load_option, start_date, end_date):
    start_date = start_date
    end_date = end_date

    df_time_dim = pd.DataFrame({'date': pd.date_range(start_date, end_date)})
    df_time_dim['year'] = df_time_dim['date'].dt.year
    df_time_dim['quarter'] = df_time_dim['date'].dt.quarter
    df_time_dim['month'] = df_time_dim['date'].dt.month
    df_time_dim['day'] = df_time_dim['date'].dt.day
    df_time_dim['day_of_week'] = df_time_dim['date'].dt.dayofweek
    df_time_dim.set_index('date', inplace=True)

    if load_option == 'append':
        df_time_dim.to_sql(target_table, target_engine, if_exists='append', index=True)
    else:
        df_time_dim.to_sql(target_table, target_engine, if_exists='replace', index=True)
