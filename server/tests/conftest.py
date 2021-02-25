import pytest

from ..app import create_app, db

@pytest.fixture
def app():
    return create_app(is_testing=True)

@pytest.fixture
def database(app):
    with app.app_context():
        try:
            db.create_all()
            yield
        finally:
            db.session.close()
            db.drop_all()
