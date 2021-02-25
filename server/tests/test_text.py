from ..app.models.text import Text

def test_01_add(app, database):
    text = Text.add('home', 'Lorem ipsum dolor sit amet, consectetur '
        + 'adipiscing elit. Ut vel massa arcu. Ut tincidunt vestibulum '
        + 'eros, congue tempus dolor ultricies sodales. Praesent vel dui '
        + 'pellentesque, condimentum nulla id, efficitur metus. Morbi at '
        + 'porta nisl, ac venenatis massa. Mauris ut ultrices libero. '
        + 'Vivamus vitae augue vulputate, ultricies enim sit amet, '
        + 'imperdiet nunc. Curabitur egestas eget erat eu elementum. '
        + 'Nullam non ullamcorper arcu. Duis pulvinar eu felis eget '
        + 'placerat. Nullam sed lacus vel nisi porttitor interdum '
        + 'scelerisque id velit. Pellentesque facilisis, magna ac '
        + 'porttitor feugiat, ligula nulla scelerisque nibh, eu tincidunt '
        + 'ipsum urna sed nisi. Donec tincidunt nulla a molestie '
        + 'fermentum. Suspendisse.')
    assert text is not None

def test_02_get_from_section(app, database):
    Text.add('home', 'Lorem ipsum')
    home_text = Text.get_from_section('home')
    assert home_text is not None and home_text.body == 'Lorem ipsum'

def test_03_get_from_section_fail(app, database):
    text = Text.get_from_section('index')
    assert text is None

def test_04_update(app, database):
    text = Text.add('home', 'Lorem ipsum')
    Text.update_body('home', 'Texto atualizado')
    text = Text.get_from_section('home')
    assert text is not None and text.body == 'Texto atualizado'

def test_05_update_fail(app, database):
    text = Text.add('home', 'Lorem ipsum')
    updated = Text.update_body('faq', 'Texto atualizado')
    text = Text.get_from_section('home')
    assert text is not None and text.body == 'Lorem ipsum' and updated is None
