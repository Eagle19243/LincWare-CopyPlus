function isSource() {
    let url = new URL(location.href);
    let target = url.searchParams.get('target');
    
    return target === 'source';
}

function getTarget() {
    return isSource() ? 'source' : 'destination';
}